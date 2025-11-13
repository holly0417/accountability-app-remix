
import {type ActionFunctionArgs} from "react-router";
import type {Route} from "./+types/partner-tasks"; //this is OK!
import SearchPartner from "../components/SearchPartner"


export default function PartnerTasks(){
    return(
        <div>
            <SearchPartner />
        </div>
    );
}