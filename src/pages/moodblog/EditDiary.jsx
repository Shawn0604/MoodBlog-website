import { Input } from 'antd';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from "../../partials/dashboard/Layout";
import { useUser } from "@clerk/clerk-react";
import axios from 'axios';
// import React, { useState } from 'react';


// import happyImg from './images/moods/happy.jpg';
// import sadImg from './images/moods/sad.jpg';
// import angryImg from './images/moods/angry.jpg';
// import surprisedImg from './images/moods/surprised.jpg';
// import calmImg from './images/moods/calm.jpg';


export default function EditDiary() {
  const { TextArea } = Input;
  const [text, setText] = useState("")
  const [data, setData] = useState(null)
  const [diaryId, setDiaryId] = useState(null);
  const [responseContent, setResponseContent] = useState(null);
  const [aiResponseContent, setAIResponseContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diaryCreatedToday, setDiaryCreatedToday] = useState(false); 
  const [moodDescription, setMoodDescription] = useState('');

  // const [mood, setMood] = useState("");



  // Clerk user.
  const { user } = useUser();

  // Format current date.
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();

  // console.log("diaryId: ", diaryId);

  const handleNavLinkClick = async () => {
    if (diaryCreatedToday) {
      // 如果已经创建了今天的日记，只更新会话
      UpdateSession(diaryId, text, selectedMood);
    } else {
      // 否则，创建新的日记
      const requestData = {
        userId: user.id,
        mood: moodMappings[selectedMood],
        description: moodDescription // 將選擇的心情轉換為文字值
      };
  
      fetch('https://mood-blog-backend-ruddy.vercel.app/gettodaySessions/createDiary', {
      // fetch('http://localhost:3000/createDiary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })
        .then(response => response.json())
        .then(data => {
          console.log("createdAt", data.createdAt);
          console.log("createDiaryData", data);
          setDiaryCreatedToday(true); // 设置为已创建今天的日记
          setDiaryId(data.diaryId);
          UpdateSession(data.diaryId, text, selectedMood);
        })
        .catch(error => {
          console.error('API 呼叫失敗：', error);
        });
    }
  };
  
  


  const UpdateSession = (diaryId, content, mood) => {
  console.log("content: ", content);
  console.log("diaryId: ", diaryId);
  console.log("mood: ", mood);
  if (diaryId) {
    axios.put(`https://mood-blog-backend-ruddy.vercel.app/gettodaySessions/updateDiary/${diaryId}`, {
    // axios.put(`http://localhost:3000/updateDiary/${diaryId}`, {
      content: content,
      mood: mood,
      description: moodDescription// 將心情值發送到後端
    })
      .then((res) => {
        console.log("Session data: ", res.data);
        setDiaryId(res.data.diaryId);
        setResponseContent(res.data.content);
      })
      .catch((err) => {
        console.log("Update session error: ", err);
      });
  } else {
    console.log("diaryId is null or undefined");
  }
};

  




  // 處理AI chat API call.
  const AIHandler = (content) => {
    setLoading(true); // set loading as true
  
    console.log("user:", user.id);
    console.log("content:", content);
    console.log("diaryId:", diaryId);
    const url = `https://mood-blog-backend-ruddy.vercel.app/gettodaySessions/getAiResponse/${diaryId}`;
    // const url = `http://localhost:3000/getAiResponse/${diaryId}`;
    
    axios.post(url, {
      userId: user.id,
      content: content,
    })
    .then((res) => {
      console.log("AI response: ", res.data);
      setAIResponseContent(res.data.message); // set aiResponseContent
      setLoading(false); // after finishing loading, set the loading as false
    })
    .catch((err) => {
      console.log("AI Handler error:", err);
      setLoading(false); // after finishing loading, set the loading as false
    });
  }; 


  const [selectedMood, setSelectedMood] = useState(null);

    const setMood = (mood) => {
        setSelectedMood(mood);
    };

  const moodMappings = {
    happy: "開心",
    sad: "難過",
    angry: "生氣",
    surprised: "驚訝",
    calm: "平靜"
  };
    
  
  
  
  
  
  

  

  // useEffect(() => {
  //   if (!user) return;
  //   console.log("kkk");
  //   handleNavLinkClick();
  // }, [user]);
  return (
<Layout>
    
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: "#FFFAF0", width: '100%', minHeight: '100vh', padding: '20px 0' }}>
        <div className='pt-8 pb-4 font-semibold text-xl' style={{ color: "#FF8C00",fontSize: '30px' }}>撰寫日記 - {formattedDate}</div>
        {/* 日記輸入框 */}
        <div style={{
            width: 800,
            marginBottom: 18,
            backgroundColor: "#FFF8DC",
            borderColor: "#FFEBAD",
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0,0,0, 0.1)',
            padding: '15px',
            transition: 'box-shadow 0.3s ease-in-out',
            fontSize: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px', // 調整間距
        }}>
          {/* 心情選擇器 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}> 
            <p style={{ textAlign: 'center', fontSize: '20px' }}>請選擇這份日記的心情~</p> 
            <div className="mood-selector" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '30px' }}>
                {["happy", "sad", "angry", "surprised", "calm"].map(mood => (
                    <button key={mood} onClick={() => setMood(mood)} style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: '0', margin: '0' }}>
                        <img src={`/images/moods/${mood}.png`} alt={mood} style={{ width: '50px', height: '50px', border: mood === selectedMood ? '2px solid #FF6347' : 'none', borderRadius: '50%' }} />
                    </button>
                ))}
            </div>
        </div>
{/* 新增的單行文字輸入框 */}
<input
        type="text"
        placeholder="請在這裡輸入心情簡述~"
        style={{
            width: '780px', // 較外層div略小以適應padding
            padding: '10px',
            marginBottom: '18px',
            backgroundColor: "#FFF8DC", 
            borderColor: "#FFEBAD", 
            color: "#6b442a", 
            borderRadius: '15px', 
            boxShadow: '0 4px 6px rgba(0,0,0, 0.1)',
        // padding: '15px', 
        transition: 'box-shadow 0.3s ease-in-out',
        fontSize: '1rem' 
        }}
        onChange={(e) => setMoodDescription(e.target.value)}

      />
        <TextArea
    showCount
    maxLength={300}
    style={{
        width: 800,
        height: 400,
        marginBottom: 18,
        backgroundColor: "#FFF8DC", 
        borderColor: "#FFEBAD", 
        color: "#6b442a", 
        borderRadius: '15px', 
        boxShadow: '0 4px 6px rgba(0,0,0, 0.1)',
        padding: '15px', 
        transition: 'box-shadow 0.3s ease-in-out',
        fontSize: '1rem' 
    }}
    onChange={(e) => setText(e.target.value)}
    placeholder="今天發生了什麼呢？"
    onFocus={() => {
   
      this.style.boxShadow = '0 6px 8px rgba(0,0,0, 0.15)';
  }}
  onBlur={() => {
    this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  }}
/>

            
        </div>
    
    

        <div className="flex flex-col w-full items-center justify-center gap-5 mt-12 mb-20 px-5">
            <div className="flex items-center gap-5">
                <button onClick={() => {
                    handleNavLinkClick();
                }} className="text-white font-semibold text-xl rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-150
                hover:bg-amber-600 active:bg-orange-600 focus:outline-none focus:ring focus:ring-orange-600/75" style={{ height: '55px', width: '60px', backgroundColor: "#FF6347", borderColor: "#FF4500" }}>
                    儲存
                </button>
                {responseContent && (
                    <div className="flex items-center gap-5">
                        <button
                            className="px-1 py-1 text-white font-semibold text-xl rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-150"
                            style={{ height: '55px', width: '70px', backgroundColor: "#FF6347", borderColor: "#FF4500" }}
                            onClick={() => AIHandler(text)}
                        >
                            AI 聊聊
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* <div className="mood-selector">
          <h2>選擇今天的心情</h2>
          <div>
            {["happy", "sad", "angry", "surprised", "calm"].map(mood => (
              <button key={mood} onClick={() => setMood(mood)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <img src={`/images/moods/${mood}.jpg`} alt={mood} style={{  height: '100px' }} />
              </button>
            ))}
          </div>
        </div> */}


        {loading && (
            <div
                style={{
                  width: 800,
                  height: 200,
                  marginBottom: 18,
                  backgroundColor: "#FFF8DC", 
                  borderColor: "#FFEBAD", 
                  color: "#6b442a", 
                  borderRadius: '15px', 
                  boxShadow: '0 4px 6px rgba(0,0,0, 0.1)',
                  padding: '15px', 
                  transition: 'box-shadow 0.3s ease-in-out',
                  fontSize: '1rem' 
                }}
            >
                Loading...
            </div>
        )}

        {!loading && aiResponseContent && (
            <div
                style={{
                  width: 800,
                  height: 200,
                  marginBottom: 18,
                  backgroundColor: "#FFF8DC", 
                  borderColor: "#FFEBAD", 
                  color: "#6b442a", 
                  borderRadius: '15px', 
                  boxShadow: '0 4px 6px rgba(0,0,0, 0.1)',
                  padding: '15px', 
                  transition: 'box-shadow 0.3s ease-in-out',
                  fontSize: '1rem' 
                }}
            >
                {aiResponseContent}
            </div>
        )}

    </div>
</Layout>

  );
}
