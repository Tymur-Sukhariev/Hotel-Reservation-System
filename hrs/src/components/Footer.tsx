import styles from '../styles/footer.module.css'

export default function Footer(){
    return(
            <footer className={styles.footer}>
                <section>
                    <div>
                        <h1>Contact Us</h1>
                        <p>hotelsupport@gmail.com</p>
                    </div>

                    <div>
                        <h1>Room Types</h1>
                        <p>The hotel provides Comfort and Standard options for each room type.</p>
                    </div>

                    <div>
                        <h1>For Parents</h1>
                        <p>Get 5% discount with 
                        each child.</p>
                    </div>
                </section>
 
                <div>
                    <p>© 2025 All rights reserved by HOTEL. </p>
                    &
                    <p> Privacy Policy</p>
                </div> 
            </footer>
    )
}