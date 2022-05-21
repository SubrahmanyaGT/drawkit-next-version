import { useRouter } from "next/router";
const Illustrations = () => {
    const router = useRouter()
    const { slug } = router.query
    return (
        <div>
            {slug}
        </div>
    );
}




// export const getStaticProps = async (ctx) => {


//     return {
//         props:{
//             data:null
//         }
//     }
// }

export default Illustrations;