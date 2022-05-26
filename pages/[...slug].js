import {useRouter} from 'next/router';
export default function Home() {
  const router = useRouter()
  const { slug =[]} = router.query
  console.log(slug);
  return(<>
  {
    
    (()=>{if(true){
      return(<div>
      {
        slug.map((s)=>s+'/')
      }
      </div>)
    }
    else{
      return(<div>
      illust types else
      </div>)
    }})()
     
  }
  </>
  )
}
