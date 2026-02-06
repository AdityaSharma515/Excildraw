import Collaborator from "./Collaborator"

export default async function CollaboratorsPage({params}:{params:{id:string}}) {
  const id=(await params).id
  console.log(id);
  return (
    <Collaborator id={id}/>
  )
}
