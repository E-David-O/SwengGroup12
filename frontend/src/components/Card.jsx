import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
  } from "@material-tailwind/react";
import NavbarButton from "./NavbarButton";
   
function DashboardCard(props) {
    return (
      <Card placeholder="" className="mt-6 w-96 rounded-xl flex flex-col">
        <CardHeader placeholder="" color="blue-gray" className="relative h-auto rounded-xl">
          <img
            src={props.imgUrl}
            alt="dashboard-card"
            className="rounded-xl w-full h-60"
          />
        </CardHeader>
        <CardBody placeholder="" className="flex-grow">
          <Typography placeholder="" variant="h5" color="blue-gray" className="mb-2">
            {props.cardTitle}
          </Typography>
          <Typography placeholder="">
            {props.cardDescription}
          </Typography>
        </CardBody>
        <CardFooter placeholder="">
            <a 
                href={props.buttonLink}
                className="inline-block"
            >
                    <NavbarButton buttonText={props.buttonText} colour={props.buttonColour}/>
            </a>
        </CardFooter>
      </Card>
    );
  }

export default DashboardCard;