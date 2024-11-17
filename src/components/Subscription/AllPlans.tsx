import { Box, Button, Card, CardContent, CardHeader, Container, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import "./Subscription.css"
import { get, post } from '../../services/api/api-service';
import { convertRupeesToPaise } from '../../Helpers/common.helper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { ACTIVE_BUSINESS_ID, planDetails } from '../../utils/constants';
import { act, useEffect, useState } from 'react';

function AllPlans() {

    const businessDetails = useSelector((state: any) => state.business.businessDetails);
    const userDetails = useSelector((state: any) => state.user.userDetails);
    const [plans, setPlans] = useState<any>({
        details: null
    });
    const [subFooterText, setSubFooterText] = useState<any>(null);


    const handlePayment = async (plan: any) => {
        try {
          console.log(plan)
            // Request the order creation from the backend
            let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
            const response : any = await get(`/payment/create?businessId=${businessId}&planId=${plan.id}`);

            if(!response?.isSuccess){
                toast.error("Unable to create order!");
            }

            const { id, amount, currency } = response?.data;

            // Configure options for Razorpay
            const options = {
                key: 'rzp_test_EJXuHjdwko5Q6m', // replace with your Razorpay key_id
                amount: amount,
                currency: currency,
                name: 'EWNS Web Services',
                description: `Purchase ${plan.id} for business ${businessDetails.businessName} at ${plan.price}`,
                order_id: id,
                handler: handlePostPayment,
                prefill: {
                    name: userDetails.name,
                    email: userDetails.email,
                    contact: userDetails.mobileNumber,
                },
                theme: {
                    color: '#3399cc',
                },
            };

            // Initialize Razorpay
            const rzp1 = new window.Razorpay(options);
            console.log(rzp1);
            rzp1.open();
        } catch (error) {
            console.error('Error in payment:', error);
        }
    };

    const handlePostPayment = async (response: any) => {
        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
        const result : any = await post(`/payment/verify?businessId=${businessId}`, response)
        console.log(result);
    }

    const getSubscriptionText = (mySub: any, actualSub: any) => {
      let myPlan = planDetails.find((x:any) => x.subscriptionId === mySub);
      let actPlan = planDetails.find((x:any) => x.subscriptionId === actualSub);
      let currSub = parseInt(myPlan?.price as string);
      let mySubPrice = parseInt(actPlan?.price as string);
      let res = null;
      if(mySubPrice === currSub) res = "Current Plan";
      else if(mySubPrice  < currSub) res = "Upgrade Plan";
      else res = null;

      return(
        <>
        {res &&
        <Button
        variant="outlined"
        color="primary"
        size="large"
        sx={{
          borderRadius: 0,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          mt: 'auto'
        }}
        fullWidth
      >
        {res}
      </Button> }
        </>
      )
    }

    return (
        <div className="w-full" style={{ fontFamily: "source Sans pro" }}>
            <div className=" bg-white p-2 h-[100%] shadow-md w-full" style={{ }}>
                <Stack width={"100%"} style={{  }}>
                    <Card sx={{ padding: "2%", height: "80%", width:"100%", overflow:"auto" }}>
                        <Box  sx={{ height: "800px", width:"100%", display:"flex", gap:"30px"  }}>
                          {planDetails.map((subscriptionDetails, index) => (
                              <Card
                                variant="outlined"
                                onClick={()=>handlePayment(subscriptionDetails)}
                                sx={{
                                  height:"85%",
                                  cursor: subscriptionDetails.subscriptionId === userDetails?.subscriptionDetails?.subscriptionId ? "" : "pointer",
                                  width:"25%",
                                  transition: 'transform 0.3s',
                                  '&:hover': subscriptionDetails.subscriptionId === userDetails?.subscriptionDetails?.subscriptionId ? {} : {
                                    transform: 'scale(1.05)',
                                    boxShadow: 4,
                                  },
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <CardHeader
                                  title={subscriptionDetails?.name}
                                  subheader={`${subscriptionDetails.currency} ${subscriptionDetails.price} / ${subscriptionDetails.type}`}
                                  titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
                                  subheaderTypographyProps={{ variant: 'h6', color: 'primary.main' }}
                                  sx={{ textAlign: 'center', bgcolor: 'background.paper' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                  <Typography sx={{height:"90px"}} variant="body2" color="text.secondary" paragraph>
                                    {subscriptionDetails.description}
                                  </Typography>
                                  <Divider sx={{ my: 2 }} />
                                  <Typography variant="subtitle1" gutterBottom>
                                    Additional Information:
                                  </Typography>
                                  <List dense>
                                    {subscriptionDetails.additionalInfo.map((info: any, index: any) => (
                                      <ListItem key={index} disableGutters>
                                        <ListItemIcon>
                                          {info.Value === "Not Included" ? <CancelIcon sx={{color: "red"}} /> : <CheckCircleIcon color="success" />}
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={`${info.Key}: ${info.Value}`}
                                          primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </CardContent>
                                <>{getSubscriptionText(subscriptionDetails.subscriptionId, userDetails.subscriptionDetails.subscriptionId)}</>  
                              </Card>
                          ))}
                        </Box>
                    </Card>
                </Stack>
            </div>
        </div>
    )
}

export default AllPlans;