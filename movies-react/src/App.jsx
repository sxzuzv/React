import haemkick from './assets/haemkick.jpeg';

const user = {
  name: 'HAEM',
  imageUrl: haemkick,
  imageSize: 90,
};

const products = [
  { title: 'rice', id: 1 },
  { title: 'kuri', id: 2 },
  { title: 'diesel', id: 3 },
];

function ShoppingList() {
  const shoppingItem = products.map(p => 
    <li key={ p.id }>
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
  return (
    <button>이것은 버튼입니당 . .</button>
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