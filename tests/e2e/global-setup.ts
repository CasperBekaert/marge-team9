import { BASE_URL } from './helpers'
export default async function globalSetup(){
 const response=await fetch(new URL('/',BASE_URL),{signal:AbortSignal.timeout(30000)})
 if(response.status!==200)throw Error(`The site returned ${response.status}`)
}
