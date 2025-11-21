import SearchPartner from "../components/SearchPartner"
import type {ActionFunctionArgs} from "react-router";
import {RelationshipStatus} from "~/components/dto/relationship/RelationshipStatus";
import {relationshipData} from "~/composables/RelationshipData";
import {userData} from "~/composables/UserData";
import {RelationshipDirection} from "~/components/dto/relationship/RelationshipDirection";
import type {RelationshipDto} from "~/components/dto/relationship/RelationshipDto";
import {DefaultPage} from "~/components/pagination/Page";
import type {Page} from "~/components/pagination/Page";
import PartnerDataGrid from "~/components/Tables/partner-grid";
import type { Route } from "./+types/partner-tasks";
import {useLoaderData} from "react-router-dom";
import type {RelationshipStatusDto} from "~/components/dto/relationship/RelationshipStatusDto";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const { getRequests, getRelationshipsByStatus } = relationshipData();
    const { getCurrentUserInfo } = userData();

    const currentUser = await getCurrentUserInfo();
    const waitList = await getRequests(RelationshipStatus.PENDING, RelationshipDirection.RECEIVER);
    const answerList = await getRequests(RelationshipStatus.PENDING, RelationshipDirection.SENDER);
    const rejectedList = await getRequests(RelationshipStatus.REJECTED, RelationshipDirection.SENDER);
    const approvedList = await getRelationshipsByStatus(RelationshipStatus.APPROVED);

    //TODO: get these lists into one and load them to partner-grid.tsx

   return {answerList, waitList, rejectedList, approvedList, currentUser};
}


export async function clientAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get('intent');
    const { sendRequest, updateRelationship, deleteRelationship } = relationshipData();

    const thisId = formData.get("id") as string; //can be partnerID or relationshipID
    const idNumber = Number(thisId);

    //delete this later
    const newStatus: RelationshipStatusDto = {
        status: RelationshipStatus.APPROVED
    }

    if(intent === "REQUEST"){
        return await sendRequest(idNumber);
    }

    if(intent === "APPROVE"){
        return await updateRelationship(idNumber, newStatus);
    }

    if(intent === "DELETE"){
        return await deleteRelationship(idNumber);
    }

}


export default function PartnerTasks(){
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