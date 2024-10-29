import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "react-router";
import invariant from "tiny-invariant";

import { deleteContact } from "~/data";

export const action = async ({params,request} : ActionFunctionArgs) => {
    invariant(params.contactId, "Missing contactId in Param")
    await deleteContact(params.contactId)
    return redirect(`/`)
}