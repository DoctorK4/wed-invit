import { addRSVP } from "./api/addRSVP";

function App() {
  const handleClick = async () => {
    await addRSVP("test", "6425");
  }

  return (
    <>
     <h1 className="text-3xl font-bold underline">Hello World</h1>
     <button type="button" onClick={handleClick}>send rsvp</button>
    </>
  )
}

export default App
