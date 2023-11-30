import React, { useEffect, useState, useRef } from 'react';
import 'routes/ManagerPage/ManagerPage.css';
import { Chart, LinearScale, BarController, BarElement, CategoryScale } from 'chart.js';
Chart.register(LinearScale, BarController, BarElement, CategoryScale);

// 쓰레기 양에 따라 텍스트를 반환하는 함수
const getTrashAmountText = (amount) => {
  if (amount < 10 && amount > 0) {
    return '매우 많음';
  } else if (amount >= 10 && amount < 15) {
    return '많음';
  } else if (amount >= 15 && amount < 20) {
    return '보통';
  } else if (amount >= 20 && amount < 25) {
    return '적음';
  } else if (amount >= 25) {
    return '매우 적음';
  } else {
    return '';
  }
};

// 쓰레기 양을 비율로 변환하는 함수
const getTrashAmountPercentage = (amount) => {
  if (amount < 10 && amount > 0) {
    return 100; // 매우 많음일 때 100의 비율
  } else if (amount >= 10 && amount < 15) {
    return 75; // 많음일 때 75의 비율
  } else if (amount >= 15 && amount < 20) {
    return 50; // 보통일 때 50의 비율
  } else if (amount >= 20 && amount < 25) {
    return 25; // 적음일 때 25의 비율
  } else if (amount >= 25) {
    return 10; // 매우 적음일 때 10의 비율
  } else {
    return 0;
  }
};

const ManagerPage = () => {
  const [chartData, setChartData] = useState([]); // 차트 데이터를 저장할 상태 변수
  // const [trashAmountText, setTrashAmountText] = useState(''); // 쓰레기 양을 저장할 상태 변수
  const chartRef = useRef(null); // 차트 캔버스 요소

  // thingspeak API에서 가장 마지막에 업데이트된 센서값만 추출해 그래프로 나타내는 함수 
  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://api.thingspeak.com/channels/2363439/feeds.json?results=1'
      );

      if (response.ok) {
        const data = await response.json();
        const latestEntry = data.feeds[0];
        setChartData([latestEntry.field1]); // 가져온 센서 값으로 차트 데이터 업데이트
        localStorage.setItem('chartData', JSON.stringify([latestEntry.field1])); //  // 차트 데이터를 로컬 스토리지에 저장
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  // 센서값 업데이트를 위한 간격 설정
  useEffect(() => {
    const storedChartData = JSON.parse(localStorage.getItem('chartData'));
    if (storedChartData) {
      setChartData(storedChartData);
    }
    
    const interval = setInterval(fetchData, 5000); // 5초마다 api에서 센서 값 가져오기 
    return () => clearInterval(interval); // 구성 요소 마운트 해제 시 간격 지우기 
  }, []);

  // 차트를 기반으로 렌더링 및 업데이트를 처리하는 효과
  useEffect(() => {
    if (chartRef.current && chartData.length > 0) {
      const trashAmount = chartData[0];
      const trashAmountPercentage = getTrashAmountPercentage(trashAmount);
      const trashAmountText = getTrashAmountText(trashAmount);

      // const text = getTrashAmountText(trashAmount);
      // setTrashAmountText(text); // 쓰레기 양 상태 변수 업데이트
      

      if (!chartRef.current.chart) {
        // 차트 인스턴스가 없는 경우 새 인트턴스 생성
        chartRef.current.chart = new Chart(chartRef.current, {
          type: 'bar',
          data: {
            labels: [`모델명 : Call Me Trash To Treasure \n 쓰레기 양 : ${trashAmountText}`],
            datasets: [
              {
                label: 'ThingSpeak Data',
                data: [trashAmountPercentage],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                borderRadius: 10,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true, // y축 값을 0으로 시작
                suggestedMax: 100, // y축 최대값
                ticks: {
                  stepSize: 10, // 간격 설정
                },
              },
            },
          },
        });
      } else {
        // 차트 업데이트
        const trashAmountText = getTrashAmountText(trashAmount);
        chartRef.current.chart.data.datasets[0].data = [trashAmountPercentage];
        chartRef.current.chart.data.labels = [`모델명 : Call Me Trash To Treasure \n 쓰레기 양 : ${trashAmountText}`];
        chartRef.current.chart.data.datasets[0].borderRadius = 10;
        chartRef.current.chart.update();
      }
    }
  }, [chartData]);

  return (
    <div className='general_trash'>
      <div className='chart_container'>
        <canvas ref={chartRef} width="400" height="400" /> 
      </div>
      {/* <div>
        모델명 : Call Me Trash To Treasure <br />
        쓰레기 양 : {trashAmountText}
      </div> */}
    </div>
  );
};

export default ManagerPage;