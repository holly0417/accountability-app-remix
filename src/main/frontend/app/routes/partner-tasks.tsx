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

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const { getRequests, getRelationshipsByStatus } = relationshipData();
    const { getCurrentUserInfo } = userData();

    const currentUser = await getCurrentUserInfo();
    const waitList = await getRequests(RelationshipStatus.PENDING, RelationshipDirection.RECEIVER);
    const answerList = await getRequests(RelationshipStatus.PENDING, RelationshipDirection.SENDER);
    const rejectList = await getRequests(RelationshipStatus.REJECTED, RelationshipDirection.SENDER);
    const approveList = await getRelationshipsByStatus(RelationshipStatus.APPROVED);

    //TODO: get these lists into one and load them to partner-grid.tsx

   return {answerList, waitList, rejectList, approveList, currentUser};
}


export async function clientAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get('intent');

    if(intent === "REQUEST"){
        const { sendRequest } = relationshipData();
        const partnerId = formData.get("id") as string;
        const idNumber = Number(partnerId);

        return await sendRequest(idNumber);
    }
}


export default function PartnerTasks(){
    const {answerList, waitList, rejectList, approveList, currentUser} = useLoaderData<typeof clientLoader>();

    return(
        <div>
            <SearchPartner />
            <PartnerDataGrid listType = "wait" friends={waitList} currentUser={currentUser}/>
            <PartnerDataGrid listType = "answer" friends={answerList} currentUser={currentUser}/>

        </div>
    );
}