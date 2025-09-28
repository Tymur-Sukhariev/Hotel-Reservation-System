import { SignInForm } from "./sign-in-form";
import styles from '../../../styles/sign-in.module.css'
import { redirect } from "next/navigation";
import { getSession } from "~/server/action";

type Props = {
    searchParams : Promise<Record<string, string>>;
}

export default async function SignIn({searchParams} : Props){

    const session = await getSession()
    if(session) redirect('/')
        
    const search  = await searchParams;

    return(
        <main className={styles.main}>
            <h1>Sign In</h1>
            <SignInForm previousPath={search.previous}/>
        </main>
    )
}