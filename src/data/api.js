export const fetchUrl = async (url) =>{
  const res = await fetch(url)
  const json = await res.json()
  return new Promise((resolve)=>{
    resolve(json)
  })
}
