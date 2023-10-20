import './App.css';
import { useEffect, useState } from 'react';
import Poll from './Poll.json';
import { ethers } from "ethers";

// Update with the contract address logged out to the CLI when it was deployed 
const pollAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  // Store candidates in local state
  const [questions, setQuestions] = useState([]);
  const [accountAddress, setAccountAddress] = useState('');
  const [choices, setChoices] = useState([]);
  const [rights, setRights] = useState(false);
  const [expiry, setExpiry] = useState(999999999999999);
  const [currentTime, setCurrentTime] = useState(999999999999999); 

  // Request access to the user's NekoMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // Call the smart contract; fetch the current list of questions and populate the checkboxes array
  function fetchQuestions() {
    if (typeof window.ethereum !== 'undefined') {
      requestAccount()
        .then(() => {
          setQuestions([]);
          setChoices([]);
          const provider = new ethers.BrowserProvider(window.ethereum);
          provider.listAccounts().then(data => {
            setAccountAddress(data[0].address)
            if (data[0].address !== '') {
              contract.voters(data[0].address)
                .then(flag => { setRights(flag); console.log(flag); })
                .catch(flag => { setRights(flag); console.log(flag); });
            }
          });
          const contract = new ethers.Contract(pollAddress, Poll.abi, provider);
          contract.questionsCount().then(dataLength => {
            for (let i = 1n; i <= dataLength; i++) {
              contract.questions(i).then(question => {
                setQuestions(questions => [...questions, question]);
                setChoices(choices => [...choices, false]);
              })
            }
          });
          contract.expiresAt().then(epochEnd => {
            const expires = Number(epochEnd);
            setExpiry(expires);
          })
        })
        .catch(err => console.log("Error: ", err));
    }    
  }

  useEffect(() => {
    fetchQuestions();
  }, [])

  useEffect(() => {
    if ((expiry - currentTime) < 0) {
      setRights(true);
    }
    setInterval(() => {
      const time = Math.trunc(new Date().getTime() / 1000);
      setCurrentTime(time);
    }, 1000)
  }, [currentTime, expiry])

  useEffect(() => {
    if(window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
    }
  });

  const handleTicks = (e) => {
    //Create a deep copy
    let cloneChoices = JSON.parse(JSON.stringify(choices));
    cloneChoices[e.currentTarget.id] = !cloneChoices[e.currentTarget.id];
    setChoices(cloneChoices);
  }

  // Call the smart contract, send an update
  async function castVote() {
    if (typeof window.ethereum !== 'undefined') {
      requestAccount()
        .then(async () => {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(pollAddress, Poll.abi, signer);
          const transaction = await contract.vote(choices);
          await transaction.wait();
          fetchQuestions();
        })
        .catch(err => console.log("Error: ", err));
    }    
  }

  return (
    <div className="App">
      <header className="App-header">
        {
          expiry - currentTime > 0 ?
            <p>Voting ends in: {expiry - currentTime}s.</p> :
            <p>Voting period has expired. You can now view poll results.</p>
        }
        {
          accountAddress === '' ?
            <p>Account: Not connected...</p> :
            <p>Account: {accountAddress}</p>
        }
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Question</th>
              <th>Yes</th>
              <th>No</th>
              <th>Your Answer</th>
            </tr>
          </thead>
          <tbody>
            {
              questions.length !== 0 && 
                questions.map(question => (
                  <tr key={question.id}>
                    <td>{Number(question.id)}</td>
                    <td>{question.prompt}</td>
                    {
                      expiry - currentTime < 0 ?
                        <>
                          <td>{Number(question.yesVoteCount)}</td>
                          <td>{Number(question.noVoteCount)}</td>
                        </> :
                        <>
                          <td>X</td>
                          <td>X</td>
                         </>
                    }
                    <td><input type="checkbox" id={Number(question.id) - 1} value={choices[Number(question.id) - 1]} onInput={(e) => handleTicks(e)}/></td>
                  </tr>
                ))
            }
          </tbody>
        </table>
        {
          questions.length === 0 && <p>Loading...</p>
        }
        <br/>
        {
          questions.length !== 0 && <button type='button' onClick={() => castVote()} disabled={rights}>Cast Vote</button>
        }
        {
          rights && expiry - currentTime > 0 && <p>You've already voted.</p>
        }
      </header>
    </div>
  );
}

export default App;