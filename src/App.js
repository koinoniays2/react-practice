import './App.css';
import { useState } from 'react'; // 리액트에서 제공하는 함수

function Header(props) {
  return <header>
    <h1><a href='/' onClick={
      (event) => {
        event.preventDefault();
        props.onChangeMode();
      }
    }>{props.title}</a></h1>
  </header>
}

function Nav(props) {
  const lis = [];
  props.topics.map((item) => {
    return ( // map 사용시 reutrn을 명시적으로 해주어야 warning 발생 안함
      lis.push(<li key={item.id}><a id={item.id} href={'/read/' + item.id} onClick={(event) => {
        event.preventDefault();
        props.onChangeMode(Number(event.target.id)); 
        // 이벤트를 유발시킨 a태그의 id속성값을 넣었기때문에 문자열으로 들어온다.
        // 밑의 state에서 사용하기위해 숫자로 변환해줌
      }}>{item.title}</a></li>));
  });
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

function Article(props) {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={event => {
      // form태그를 submit했을 때 페이지리로드 막기
      event.preventDefault();
      // form태그 안에 input이 가진 name의 value를 가져온다.
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body); //props로 전달받은 onCreate에 title과 body값을 전달.
    }}>
      <p><input type="text" name="title" placeholder="title" /></p>
      <p><textarea name="body" placeholder="body" /></p>
      <p><input type="submit" value="Create" /></p>
      {/* name=사용자가 입력한 데이터의 이름 */}
    </form>
  </article>
}




export default function App() {
  const [topics, setTopics] = useState([
    { id: 1, title: 'html', body: 'html is...' },
    { id: 2, title: 'css', body: 'css is...' },
    { id: 3, title: 'js', body: 'js is...' }
  ])
  const [mode, setMode] = useState("WELCOME");
  const [id, setId] = useState(null); // Nav의 요소를 클릭할때 바뀌어야 하는 값을 설정해주기 위해
  let [nextId, setNextId] = useState(4); // topics에 새롭게 추가 될 요소의 id 설정해주기 위해

  let content = null;
  if (mode === "WELCOME") {
    content = <Article title="WELCOME" body="Hello, WELCOME!"></Article>
  } else if (mode === "REACT") {
    let title, body = null;
    for (let i = 0; i<topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
  }else if (mode === "CREAT") {
    content = <Create onCreate={(_title, _body)=> {
      //Create 컴포넌트에서 전달받은 title과 body값을 사용
      //topics에 새로운 원소를 추가해야한다.
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics]; // 복제본에 새로운 topics를 넣는다.
      newTopics.push(newTopic);
      setTopics(newTopics); //기존의 topics와 비교하여 다르다면 랜더링해준다.
      // 상세페이지 이동(내용 화면에 렌더링)
      setMode('READ'); //모드를 READ로 변경
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  }


  return (
    <div>
      <Header title="WEB" onChangeMode={() => {
        setMode("WELCOME")
      }}></Header>
      <Nav topics={topics} onChangeMode={(id) => {
        setMode("REACT")
        setId(id);
        // 클릭했을 때 id값이 바뀌면 useState의 id값이 바뀐다.
      }}></Nav>
      {content}
      <a href="/create" onClick={event => {
        event.preventDefault();
        setMode('CREAT');
      }}>Create</a>
    </div>
  );
}