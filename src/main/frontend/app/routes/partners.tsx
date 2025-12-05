import SearchPartner from "~/components/forms/SearchPartner"
import {type ActionFunctionArgs, data, redirect} from "react-router";
import {RelationshipStatus} from "~/dto/relationship/RelationshipStatus";
import {relationshipData} from "~/composables/RelationshipData";
import {userData} from "~/composables/UserData";
import {RelationshipDirection} from "~/dto/relationship/RelationshipDirection";
import PartnerDataGrid from "~/components/grids/partner-grid";
import type { Route } from "./+types/partners";
import {useLoaderData} from "react-router-dom";
import {RelationshipAction} from "~/dto/relationship/RelationshipAction";
import type {RelationshipStatusDto} from "~/dto/relationship/RelationshipStatusDto";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    try {

        const { getRequests, getRelationshipsByStatus } = relationshipData();
        const { getCurrentUserInfo } = userData();
        const currentUser = await getCurrentUserInfo();
// HANDLE 404: Logic -> If null, stop everything and throw a 404
        if (!currentUser) {
            throw data("User not found", { status: 404 });
        }

        const waitList = await getRequests(RelationshipStatus.PENDING, RelationshipDirection.RECEIVER);
        const answerList = await getRequests(RelationshipStatus.PENDING, RelationshipDirection.SENDER);
        const rejectedList = await getRequests(RelationshipStatus.REJECTED, RelationshipDirection.SENDER);
        const approvedList = await getRelationshipsByStatus(RelationshipStatus.APPROVED);

        return {answerList, waitList, rejectedList, approvedList, currentUser};

    } catch (e:any) {
// HANDLE 401: Logic -> If unauthorized, send them to login
        if (e.response?.status === 401) {
            throw redirect("/login");
        }

        throw e; // Throw generic errors to the ErrorBoundary
    }
}

export async function clientAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get('intent');
    const { sendRequest, updateRelationship, deleteRelationship } = relationshipData();

    const thisId = formData.get("id") as string; //can be partnerID or relationshipID
    const idNumber = Number(thisId);

    if(intent === RelationshipAction.REQUEST){
        return await sendRequest(idNumber);
    }

    if(intent === RelationshipAction.DELETE) {
        return await deleteRelationship(idNumber);
    }

    const newStatus: RelationshipStatusDto = {
        status: RelationshipStatus.PENDING
    }

    if(intent === RelationshipAction.APPROVE){
        newStatus.status = RelationshipStatus.APPROVED;
    }

    if(intent === RelationshipAction.REJECT){
        newStatus.status = RelationshipStatus.REJECTED;
    }

    return await updateRelationship(idNumber, newStatus);
}


export default function Partners(){

    const {answerList, waitList, rejectedList, approvedList, currentUser} = useLoaderData<typeof clientLoader>();

    return(
        <div>
            <SearchPartner />
            <PartnerDataGrid listType = "wait" friends={waitList} currentUser={currentUser}/>
            <PartnerDataGrid listType = "answer" friends={answerList} currentUser={currentUser}/>
            <PartnerDataGrid listType = "rejected" friends={rejectedList} currentUser={currentUser}/>
            <PartnerDataGrid listType = "approved" friends={approvedList} currentUser={currentUser}/>
        </div>
    );
}