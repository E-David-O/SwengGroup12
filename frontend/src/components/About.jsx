import Navbar from "./Navbar";
import Footer from "./Footer";

function About() {
    return (
        <>
            <Navbar />
            <div className="text-center">
                <h1 className="text-3xl font-bold py-4">SWENG Group 12</h1>
                <h2 className="text-2xl font-bold py-4">The frontend team</h2>
                <ul>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Louie Somers</p>
                        <p>Integrated Computer Science. Video Upload and Analysis, support for file, youtube, tiktok, and vimeo.</p>
                    </li>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Finn Cummins</p>
                        <img 
                            src="https://media.licdn.com/dms/image/D4E03AQFQbLBUHtEJjw/profile-displayphoto-shrink_800_800/0/1691618622623?e=1716422400&v=beta&t=VlL3o0q-8sOo5RrszHoEMpYDlUSsajybKhs3hNByKzQ"
                            className="h-48 inline-block rounded-3xl mx-4"
                        />
                        <p>Computer Science and Business. Managed and led the development of the UI/UX design of our frontend. Developed the landing page, user dashboard, and the design of the login/logout buttons. Ensured that only logged-in users have access to the user dashboard and video analysis services. Ensured that logged out users only have access to informational pages.</p>
                    </li>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Afaf Shadani</p>
                        <img 
                            src="https://cdn.discordapp.com/attachments/1212366514720870401/1225074581950435428/IMG_7497.jpg?ex=661fce9d&is=660d599d&hm=578366576af41dbc919912574139b3cbfbfcac02c20803f49ea369e9a827f68c&"
                            className="h-48 inline-block rounded-3xl mx-4"
                        />
                        <p>Integrated Computer Science. Developed React components and this page :)</p>
                    </li>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Daire Frankling</p>
                        <img 
                            src="https://media.licdn.com/dms/image/D4E03AQEDIYy3zjPMtw/profile-displayphoto-shrink_800_800/0/1705973307663?e=1716422400&v=beta&t=jJvNe9CQOOfOZUSuFbl5vR1DTF9NGygVi68UpmaLMUc"
                            className="h-48 inline-block rounded-3xl mx-4"
                        />
                        <p>Computer Science and Geography. Front End - Lead the Figma design, and created the UI, contact pages, and services pages.</p>
                    </li>
                </ul>
                <h2 className="text-2xl font-bold py-4">The Database team</h2>
                <ul>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Eimhin Heenan-Roberts</p>
                        <img 
                            src="https://cdn.discordapp.com/attachments/1212366514720870401/1225087478214430750/IMG_1822.jpg?ex=661fda9f&is=660d659f&hm=acfe010cac8b651ab34c614c370b8be8e98953452e9c041a7d08af06d671a98b&"
                            className="h-48 inline-block rounded-3xl mx-4"
                        />
                        <p>Integrated Computer Science. Database and Documentation.</p>
                    </li>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Conor Daly</p>
                        <img 
                            src="https://media.discordapp.net/attachments/1213128804013318214/1220682542613663784/IMG-2046.jpg?ex=660fd435&is=65fd5f35&hm=6fdfb37080f44f665f0329c331bd54a44d132dbbaaf4eb71e9a05515293c87d2&=&format=webp&width=1278&height=958"
                            className="h-48 inline-block rounded-3xl mx-4"
                        />
                        <p>Integrated Computer Science. Worked on the database side with the framework layout and queries.</p>
                    </li>
                </ul>
                <h2 className="text-2xl font-bold py-4">API team</h2>
                <ul>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Ming Him Foun</p>
                        <img 
                            src="https://cdn.discordapp.com/attachments/1220687617159463073/1220693519845294142/Weixin_Image_20240322191204.jpg?ex=661918ee&is=6606a3ee&hm=90b8609a4d0bf33c759fdd0b32d7824b19f834403c37db7065e69c134b837836&"
                            className="h-48 inline-block rounded-3xl mx-4"
                        />
                        <p>Integrated Computer Science. My main role was to bring in and fine-tune several YOLOv8 models for analyzing videos on our backend system. I worked on making the most of YOLOv8's advanced features to make our video analysis better, aiming for fast and precise identification and tracking of objects in various settings. By carefully choosing and adjusting multiple Yolov8 models, I managed to make them work well for our specific needs, allowing for quick analysis with great confidence level. My job included not just adding these models to our backend setup but also making sure they could efficiently process the demanding work of video analysis.</p>
                    </li>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Nicolas Moschenross</p>
                        <img 
                            src="https://cdn.discordapp.com/attachments/1212110787200421909/1221032679596884009/IMG_1450_Original.jpg?ex=661a54cc&is=6607dfcc&hm=112f78ec0ca3acf9de8899454f4239c30dc7546e8dfe1ca1c6d67da29dfc161e&"
                            className="h-48 inline-block rounded-3xl mx-4"
                        />
                        <p>Computer Science and Business. Worked on the message queues and airflow of the backend services.</p>
                    </li>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Rishi Manu</p>
                        <p>Integrated computer science. Containerized and designed the backend architecture.</p>
                    </li>
                </ul>
                <h2 className="text-2xl font-bold py-4">Frame analysis team</h2>
                <ul>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Emeka David Odoemelam</p>
                        <p>Integrated Computer Science. I worked on selecting optimal frames for analysis using OpenCV's SSIM and Homography techniques and its optimising the process. I also worked a little bit on the documentation.</p>
                    </li>
                    <li className="mt-8 bg-slate-100 inline-block py-4 px-4 rounded-xl">
                        <p className="bg-slate-200 py-2 px-2 rounded-xl inline-block">Ayushmaan Kumar Yadav</p>
                        <img 
                            src="https://cdn.discordapp.com/attachments/1218252418970812527/1224401940348403863/image.png?ex=661d5c2a&is=660ae72a&hm=aef75d140c313642b9efbf41ba2fadb0ec20e88b0eb769eea0e50fb4c59e934c&"
                            className="h-48 inline-block rounded-3xl mx-4"
                        />
                        <p>Integrated Computer Science. Backend - Frame Analysis using YoloV8. Github CI/CD.</p>
                    </li>
                </ul>
                <Footer />
            </div>
        </>
    );
}

export default About;