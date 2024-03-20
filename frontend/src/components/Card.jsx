import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
  } from "@material-tailwind/react";
   
function DashboardCard(props) {
    return (
      <Card placeholder="" className="mt-6 mx-2 w-96 rounded-xl">
        <CardHeader placeholder="" color="blue-gray" className="relative h-auto rounded-xl">
          <a  href={props.buttonLink}>
          <img
            src={props.imgUrl}
            alt="dashboard-card"
            className="mt-4 rounded-xl"
          />
        </a>
        </CardHeader>
        <CardBody placeholder="">
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
                className="inline-block bg-slate-100 py-2 px-4 rounded-xl"
            >
                    {props.buttonText}
            </a>
        </CardFooter>
      </Card>
    );
  }

export default DashboardCard;