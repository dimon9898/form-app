
import './App.css';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [subs, setSubs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const {
    register,
    handleSubmit,
    reset,
  } = useForm({mode: 'onBlur', defaultValues: {
    fullname: '',
    email: '',
    tarif: ''
  }});

  useEffect(() => {
    axios.get('https://form-bot-b75v.onrender.com/subscriptions', {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(resp => {
        setSubs(resp.data);
      })
  }, []);


  const onSubmit = (data, event) => {
    event.preventDefault();
    setIsLoading(true);
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.MainButton.showProgress();
      setTimeout(() => {
        window.Telegram.WebApp.sendData(JSON.stringify(data, null, 2));
        setIsLoading(false);
        reset();
      })
    } else {
      alert('ERROR SEND DATA TELEGRAM');
    }
  };




  return (
    <div className="container">
      <div className="center-div">
        <div className='top-div'></div>
        <div className='bottom-div'></div>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <h2>Оформите подписку</h2>
          <input
            className='form-input' 
            type="text" 
            placeholder='ФИО'
            {...register('fullname', {required: 'Обязательное поле!'})}
          />
          <input
            className='form-input' 
            type="email" 
            placeholder='Email'
            {...register('email', {required: 'Обязательное поле!'})}
          />
          <select {...register('tarif', {required: 'Обязательное поле!'})} className='form-select' defaultValue=''>
            <option value='' disabled>Выберите тариф</option>
            {subs.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name} | {sub.price} руб.</option>
            ))}
          </select>

          <button type='submit' className='btn' disabled={isLoading}>
            {isLoading ? <div className='spin-loader'></div> : 'Купить'}
          </button>
          <span className='div-span'></span>
          <div className='bottom-form'><p>© 2020-2025</p></div>
        </form>
      </div>
      
    </div>
  );
}

export default App;
