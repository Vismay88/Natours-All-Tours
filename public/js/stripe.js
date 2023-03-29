import axios from "axios";
import { showAlert } from "./alert";

const stripe=Stripe('pk_test_51MqJlaSCHGCKemgEp4Nw2gmtaMKPUJPwvaffl3sCzedJ95u20xfWi9v9N7WsQNJjKCSCsrCNNhsfTMOaMBodsdI6002LfzthRm');
export const bookTour = async tourId =>{
    try{
    //1.Get checkout session API
    const session=await axios(`http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`)
    //  console.log(session);
    //2. Create checkout from + chance  credit card
    await stripe.redirectToCheckout({
        sessionId:session.data.session.id
    });

    }catch(err){
     console.log(err);
     showAlert('error',err);
    }
}