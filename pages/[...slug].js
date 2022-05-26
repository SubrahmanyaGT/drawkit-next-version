import {useRouter} from 'next/router';
export default function Home() {
  const router = useRouter()
  const { slug } = router.query
  console.log(slug);
  return(
      <div>
          illust types
      </div>
  )
}
