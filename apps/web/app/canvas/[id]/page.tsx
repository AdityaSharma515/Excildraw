import RoomCanvas from "@/components/RoomCanvas";
async function Boards({params}:{params:{id:string}}) {
      const id=(await params).id ;
      console.log(id);
      return <RoomCanvas id={id} />
}

export default Boards
