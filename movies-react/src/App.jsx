import { useState } from 'react';
import haemkick from './assets/haemkick.jpeg';

const user = {
  name: 'HAEM',
  imageUrl: haemkick,
  imageSize: 90,
};

const products = [
  { title: 'rice', id: 1, isFavorite: true },
  { title: 'kuri', id: 2, isFavorite: true },
  { title: 'diesel', id: 3, isFavorite: true },
  { title: 'spicy', id: 4, isFavorite: false }
];

function ShoppingList() {
  const shoppingItem = products.map(p => 
    <li key={ p.id }
        style={{ color: p.isFavorite ? 'blue' : 'red' }}
    >
      { p.title }
    </li>
  );

  return (
    <ul>
      { shoppingItem }
    </ul>
  );
}


function Profile() {
  return (
    <>
      <h2>{ user.name }</h2>
      <img
          className="avatar"
          src={ user.imageUrl }
          alt={'Photo of ' + user.name }
          style={{
            width: user.imageSize,
            height: user.imageSize
          }}
        />
    </>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={ handleClick }>{ count }번 클릭했어용 . .</button>
  );
}

export default function MyApp() {
  const isLoggedId = true

  return (
    <div>
      <h1>HAEM의 React</h1>

      <MyButton />

      { isLoggedId ? <Profile /> : <p>로그인이 필요합니다.</p> }
      { isLoggedId && <Profile /> }
      
      <ShoppingList />
    </div>
  );
}