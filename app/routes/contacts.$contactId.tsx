import { getContact, updateContact } from "../data";
import { Form, json, useLoaderData, useFetcher } from "@remix-run/react";
import type { FunctionComponent } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { ContactRecord } from "../data";
import invariant from "tiny-invariant";

export const loader = async ({ params } : LoaderFunctionArgs) => {
    invariant(params.contactId, "Missiong contactId params")
  const contact = await getContact(params.contactId);
  if(!contact){
    throw new Response("Not Found", {status : 404})
  }
  return json({ contact });
};

export const action = async ({params, request} : ActionFunctionArgs) => {
    invariant(params.contactId, "Missing Params contactId")
    const formData= await request.formData()
    const updates = Object.fromEntries(formData)
    return updateContact(params.contactId,{
        favorite : updates.favorite === "true"
    })
}

export default function Contact() {

  const { contact } = useLoaderData<typeof loader>();
  
  return (
    contact?.id && (
      <div id="contact">
        <div>
          <img
            alt={`${contact.first} ${contact.last} avatar`}
            key={contact.avatar}
            src={contact.avatar}
          />
        </div>

        <div>
          <h1>
            {contact.first || contact.last ? (
              <>
                {contact.first} {contact.last}
              </>
            ) : (
              <i>No Name</i>
            )}{" "}
            <Favorite contact={contact} />
          </h1>

          {contact.twitter ? (
            <p>
              <a href={`https://twitter.com/${contact.twitter}`}>
                {contact.twitter}
              </a>
            </p>
          ) : null}

          {contact.notes ? <p>{contact.notes}</p> : null}

          <div>
            <Form action="edit">
              <button type="submit">Edit</button>
            </Form>

            <Form
              action="destroy"
              method="post"
              onSubmit={(event) => {
                const response = confirm(
                  "Please confirm you want to delete this record."
                );
                if (!response) {
                  event.preventDefault();
                }
              }}
            >
              <button type="submit">Delete</button>
            </Form>
          </div>
        </div>
      </div>
    )
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
    const fetcher = useFetcher()
  const favorite = fetcher.formData ? fetcher.formData.get("favorite") === "true" : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};