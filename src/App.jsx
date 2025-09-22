import { useState } from 'react'


function App() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")


  const checkSPF = async() => {

    if(!domain){

      setError("Domain is missing")
      return
    }

    setLoading(true)
    setResults(null)
    setError("")

    try {
      const res = await fetch(`https://dns.google/resolve?name=${domain}&type=TXT`)
      const data = await res.json()
      console.log(data);
      
      setLoading(false)

      if(!data.Answer){
        setError("No details available")
        return
      }

      const records = data.Answer.map(r => r.data.replace(/"/g, ""))
        .filter(txt => txt.startsWith("v=spf1"));
      console.log(records);


        if(records.length === 0){
          setError("No records found")
        }else{
          setResults(records)
        }
    } catch (err) {
      setLoading(false)
      console.log(err);
      
    }
  }


  return (
    <div className='mt-16'>
      
      <h1 className='text-3xl my-4 font-bold flex justify-center'>SPF Record Checker</h1>

      <div className='flex flex-col max-w-xl mx-auto'>


        <input className='border-2 border-blue-500 py-4' type='text' value={domain} onChange={(e) => setDomain(e.target.value)} />

        <button onClick={checkSPF} className=' mt-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-full p-4 block'>Check SPF</button>
      
        {loading && <p className='text-blue-500'>
          Cheking....
          </p>}

        {error && <p className='text-red-500'>
          {error}
          </p>}


          <h2 className='text-3xl mt-4 font-bold flex justify-center'>Results</h2>

          <div className=' border-2 border-blue-500 py-10'>
          {results?.map((result, id) => {
            return <p key={id}>{result}</p>
          })}
          
          
          </div>
      </div>
    </div>
  )
}

export default App
