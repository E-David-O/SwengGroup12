import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * 
 * @returns About component
 * @description This component will make up the page for our "About Us" page. This will feature every member of our team
 * along with a short description of what they've been working on.
 * 
 */

function About() {
    return (
        <>
            <Navbar />
            <div className="text-center">
                <h1 className="text-3xl font-bold py-4">SWENG Group 12</h1>
                <h2 className="text-2xl font-bold py-4">The frontend team</h2>
                <ul>
                    <li>Louie Somers</li>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Finn Cummins</p>
                        <img 
                            src="https://media.licdn.com/dms/image/D4E03AQFQbLBUHtEJjw/profile-displayphoto-shrink_800_800/0/1691618622623?e=1716422400&v=beta&t=VlL3o0q-8sOo5RrszHoEMpYDlUSsajybKhs3hNByKzQ"
                            className="h-48 inline-block rounded-3xl mx-4"
                        />
                        <p>Finn studies computer science and business</p>
                    </li>
                    <li>Afaf Shadani</li>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Daire Frankling</p>
                        <img 
                            src="https://media.licdn.com/dms/image/D4E03AQEDIYy3zjPMtw/profile-displayphoto-shrink_800_800/0/1705973307663?e=1716422400&v=beta&t=jJvNe9CQOOfOZUSuFbl5vR1DTF9NGygVi68UpmaLMUc"
                            className="h-48 inline-block rounded-3xl mx-4"
                        />
                    </li>
                </ul>
                <h2 className="text-2xl font-bold py-4">The Database team</h2>
                <ul>
                    <li>Eimhin Heenan-Roberts</li>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Conor Daly</p>
                        <img 
                            src="https://media.discordapp.net/attachments/1213128804013318214/1220682542613663784/IMG-2046.jpg?ex=660fd435&is=65fd5f35&hm=6fdfb37080f44f665f0329c331bd54a44d132dbbaaf4eb71e9a05515293c87d2&=&format=webp&width=1278&height=958"
                            className="h-48 inline-block rounded-3xl mx-4"
                        />
                    </li>
                </ul>
                <h2 className="text-2xl font-bold py-4">API team</h2>
                <ul>
                    <li>Ming Him Foun</li>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Nicolas Moschenross</p>
                        <img 
                            src="https://media.discordapp.net/attachments/1220464925537865781/1220500119183429642/IMG_1450_Original.jpg?ex=660f2a50&is=65fcb550&hm=ae0d9c07121ad51a7b4a6d1e3ae01c9445751a6311ad7727d33f87c4807f23c3&=&format=webp&width=632&height=958"
                            className="h-48 inline-block rounded-3xl mx-4"
                        />
                    </li>
                    <li>Rishi Manu</li>
                </ul>
                <h2 className="text-2xl font-bold py-4">Frame analysis team</h2>
                <ul>
                    <li>Emeka David Odoemelam</li>
                    <li>Ayushmaan Kumar Yadav</li>
                </ul>
                <Footer />
            </div>
        </>
    );
}

export default About;