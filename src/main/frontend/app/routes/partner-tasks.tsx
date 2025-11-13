
import SearchPartner from "../components/SearchPartner"
import type {ActionFunctionArgs} from "react-router";
import {relationshipData} from "~/composables/RelationshipData";
import {TaskAction} from "~/components/dto/task/TaskAction";
import {RelationshipStatus} from "~/components/dto/relationship/RelationshipStatus";

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
    return(
        <div>
            <SearchPartner />
        </div>
    );
}