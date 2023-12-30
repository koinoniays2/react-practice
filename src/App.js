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
function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return <article>
      <h2>Update</h2>
      <form onSubmit={event => {
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onUpdate(title, body);
      }}>
        <p><input type="text" name="title" placeholder="title" value={title} onChange={(event => {
          setTitle(event.target.value); //input안의 value값이 바뀔때 마다 다시 랜더링
        })}/></p>
        <p><textarea name="body" placeholder="body" value={body} onChange={(event => {
          setBody(event.target.value);
        })}/></p>
        <p><input type="submit" value="Update" /></p>
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
  let contextControl = null; //mode가 READ일때만 update 버튼을 렌더링

  if (mode === "WELCOME") {
    content = <Article title="WELCOME" body="Hello, WELCOME!"></Article>
  } else if (mode === "READ") {
    let title, body = null;
    for (let i = 0; i<topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <><li><a href={'/update'+ id} onClick={event => {
      event.preventDefault();
      setMode('UPDATE'); //update버튼을 눌렀을 때 mode가 UPDATE인 경우를 만든다.
    }}>Update</a></li>
    <li><input type='button' value="Delete" onClick={() => {
      const newTopics = [];
      for(let i=0; i<topics.length; i++) {
        if(topics[i].id !== id) {
          newTopics.push(topics[i]);
        }
      }
      setTopics(newTopics);
      setMode("WELCOME");
    }} /></li>
    </>
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
  }else if (mode === "UPDATE") {
    //update를 눌렀을때 클릭 한 내용을 화면에 나오게 하기 위해
    let title, body = null;
    for (let i = 0; i<topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=> {
      const updateTopic = {id:id, title:title, body:body}
      const newTopic = [...topics];
      for(let i = 0; i<newTopic.length; i++) {
        if(newTopic[i].id === id) {
          newTopic[i] = updateTopic;
          break;
        }
      }
      setTopics(newTopic);
      setMode('READ');
    }}></Update>

  }


  return (
    <div>
      <Header title="WEB" onChangeMode={() => {
        setMode("WELCOME")
      }}></Header>
      <Nav topics={topics} onChangeMode={(id) => {
        setMode("READ")
        setId(id);
        // 클릭했을 때 id값이 바뀌면 useState의 id값이 바뀐다.
      }}></Nav>
      {content}
      <ul>
        <li>
          <a href="/create" onClick={event => {
          event.preventDefault();
          setMode('CREAT');
        }}>Create</a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}