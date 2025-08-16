"use client"

import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Home() {
  const [data, setData] = useState([])

  async function fetchData() {
    const { data, error } = await supabase.from("vdot_data").select("*")
    if (error) {
      console.error(error)
    } else {
      setData(data)
    }
  }

  return (
    <main className="p-6">
      <button onClick={fetchData} className="btn">
        Fetch Data
      </button>

      <pre className="mt-4 bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  )
}
