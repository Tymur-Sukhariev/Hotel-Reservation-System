import { SignUpForm } from "./sign-up-form";
import styles from '../../../styles/sign-in.module.css'
import { getSession } from "~/server/action";
import { redirect } from 'next/navigation';

type Props = {
    searchParams : Promise<Record<string, string>>;
}

export default async function SignUp({searchParams} : Props){
    const session = await getSession()
    if(session) redirect('/')

    const search  = await searchParams;

    return(
        <main className={styles.main}>
            <h1>Sign Up</h1>
            <SignUpForm previousPath={search.previous}/>
        </main>
    )
}