// import React, { useState } from 'react';
// import Calendar from 'react-calendar';
// import Layout from '../../partials/dashboard/Layout';
// import axios from 'axios';
// import { useUser } from "@clerk/clerk-react";
// import '../../css/Rate.css';

// export default function EmotionAdvicePage() {
//   const { user } = useUser();
//   const [dateRange, setDateRange] = useState([new Date(), new Date()]);
//   const [emotionData, setEmotionData] = useState(null);
//   const [loading, setLoading] = useState(false); // 新增loading状态

//   const handleDateChange = ([start, end]) => {
//     setDateRange([start, end]);
//   };

//   const fetchEmotionData = (start, end) => {
//     const startDate = start.toISOString();
//     const endDate = end.toISOString();
    
//     setLoading(true); // 开始请求前，设置加载状态为true
//     axios.get(`http://localhost:3000/getEmotionAnalysis/${user.id}?startDate=${startDate}&endDate=${endDate}`)
//   .then(response => {
//     console.log("Received data from backend:", response.data); // 打印接收到的数据
//     setEmotionData(response.data);
//     setLoading(false); // 请求完成后，设置加载状态为false
//   })
//   .catch(error => {
//     console.error('Fetching emotion data failed:', error);
//     setLoading(false); // 出现错误时，也设置加载状态为false
//   });

//   };

//   const handleConfirmClick = () => {
//     const [start, end] = dateRange;
//     fetchEmotionData(start, end);
//   };

//   return (
//     <Layout>
//       <div className="emotion-advice-container">
//         <div className='emotion-advice-content'>
//         <h4 className="text-2xl font-bold">請選擇想要了解的情緒建議的開始日期和結束日期~</h4>

//           <Calendar onChange={handleDateChange} selectRange={true} value={dateRange} className="calendar-style" />
//           {/* <button onClick={handleConfirmClick} class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none 
//           disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg 
//           hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none mr-4" type="button" style="position: relative; overflow: hidden;"  disabled={loading}>
//             {loading ? "加载中..." : "确定"}
//           </button> */}
//           <button onClick={handleConfirmClick} className="mr-4 bg-gray-900  hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={loading}>
          
//             {loading ? "加載中..." : "確定"}
//           </button>
//           {emotionData && (<div className="emotion-data"><p>AI 回應：{emotionData.AIresponse}</p></div>)}
//         </div>
//       </div>
//     </Layout>
//   );
// }
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Layout from '../../partials/dashboard/Layout';
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";
import '../../css/Rate.css';

export default function EmotionAdvicePage() {
  const { user } = useUser();
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [emotionData, setEmotionData] = useState(null);
  const [loading, setLoading] = useState(false); // 新增loading状态
  const [aiResponseContent, setAIResponseContent] = useState(null);

  const handleDateChange = ([start, end]) => {
    setDateRange([start, end]);
  };

  const fetchEmotionData = (start, end) => {
    const startDate = start.toISOString();
    const endDate = end.toISOString();
  
    setLoading(true); // 开始请求前，设置加载状态为 true
    axios
      .get(`https://mood-blog-backend-ruddy.vercel.app/getEmotionAnalysis/${user.id}?startDate=${startDate}&endDate=${endDate}`)
      .then(response => {
        console.log("Received data from backend:", response.data); // 打印接收到的数据
        setEmotionData(response.data);
        setLoading(false); // 请求完成后，设置加载状态为 false
        setAIResponseContent(response.data.AIresponse); // 设置 AI 回应内容
      })
      .catch(error => {
        console.error('Fetching emotion data failed:', error);
        setLoading(false); // 出现错误时，也设置加载状态为 false
      });
  };
  

  const handleConfirmClick = () => {
    const [start, end] = dateRange;
    fetchEmotionData(start, end);
  };

  const AIHandler = (text) => {
    // 模拟从AI获取响应
    setLoading(true); // 开始请求前，设置加载状态为true
    setTimeout(() => {
      setAIResponseContent(`AI回应：${text}`); // 模拟从AI获取的响应
      setLoading(false); // 请求完成后，设置加载状态为false
    }, 1000);
  };

  return (
    <Layout>
      <div className="p-20 flex flex-col justify-center items-center">
        <h4 className="pt-8 pb-4 font-medium text-lg">請選擇想要了解的情緒建議的開始日期和結束日期~</h4>
        <Calendar onChange={handleDateChange} selectRange={true} value={dateRange} className="calendar-style" />
        <div className="flex items-center mt-10"></div>
        <button onClick={handleConfirmClick} className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none mr-4 mb-4" disabled={loading}>
          {loading ? "加載中..." : "確定"}
        </button>
        {loading && (
          <div
            style={{
              width: 600,
              height: 300,
              marginBottom: 18,
              backgroundColor: "#FFE8C7",
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
              width: 600,
              height: 300,
              marginBottom: 18,
              backgroundColor: "#FFE8C7",
              borderColor: "#ffd090",
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
