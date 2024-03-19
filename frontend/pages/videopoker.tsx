import BettingTable from '@/components/betting_table'
import Controls from '@/components/controls';
import Hand from '@/components/hand'
import { InstanceState } from '@/src/interfaces';
import { balance, instance_state } from '@/src/queries';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { ERR_UNAUTHORISED, pvp } from '@/generated/constants';
import { currency_str } from '@/src/helpers';
import { motion } from 'framer-motion';


function VideoPoker() {

  const { push } = useRouter();
  const [hand, setHand] = useState([255,255,255,255,255]);
  const [bet, setBet] = useState(1);
  const [dealt, setDealt] = useState(false);
  const [outcome, setOutcome] = useState('Undefined');
  const [won, setWon] = useState('-');
  const [need_vk, setNeedVk] = useState(false);
  const [held, setHeld] = useState(new Set<number>([]));
  const [user_bal, setBalance] = useState('-');
  const [updated, setUpdated] = useState('-');
  const [dark, setDark] = useState(false);
  const [last_timestamp, setLastTimeStamp] = useState(0)


  useEffect(function () {

    if (!pvp.ready ) {
      push('/')
      return;
    }


   let do_query = async function() {

      let bal = await balance();
      setBalance(`${bal[0]} ${bal[1]}`);
      let inst_state_result = await instance_state();

      if (inst_state_result[1]) {
        let inst_state = inst_state_result[0] as InstanceState;
        
        // sync state with backend
        setHand(inst_state.hand);
        setDealt(inst_state.dealt);

        if (!inst_state.dealt) {
          setOutcome(inst_state.last_outcome);

          if (inst_state.timestamp!== last_timestamp) {
            
            let this_outcome = inst_state.last_outcome;
            if (this_outcome == 'Undefined') return
            let id = 'win'
            if (inst_state.last_outcome == 'Lose') {
              id = 'lose'
            }
            var audio = document.getElementById(id);
            //@ts-ignore
            if (audio) audio.play();
            setLastTimeStamp(inst_state.timestamp)
          }

        };
        let won_curr = currency_str(inst_state.last_win, "uscrt");
        setWon(`${won_curr[0]} ${won_curr[1]}`);

      } else if (ERR_UNAUTHORISED.test(inst_state_result[0])){
        setNeedVk(true);
      } else {
        console.log(inst_state_result[0]);
      }

    }

    do_query();

    // check state every 7 seconds
    const id = setInterval(do_query, 7000);
    return () => clearInterval(id);
  },[dealt, outcome]);



  return (
    <motion.div 
    exit={{ opacity: 0 }}
    className={`w-screen h-screen relative p-10 bg-blue-800 ${dark?'invert':''}`}>

      <audio id="bet" className="display-none" src={`/audio/bet.wav`}/>
      <audio id="dealordraw" className="display-none" src={`/audio/dealordraw.wav`}/>
      <audio id="win" className="display-none" src={`/audio/win.wav`}/>
      <audio id="lose" className="display-none" src={`/audio/lose.wav`}/>
      <audio id="select" className="display-none" src={`/audio/select.wav`}/>


      <div className='w-full h-full relative bg-blue-700'>

        <BettingTable
        dealt={dealt}
        bet={bet}
        outcome={outcome}/>

        <div className={
          `p-1 text-xl text-center text-white left-0 right-0 m-auto
          ${outcome == 'Lose' || outcome == 'Undefined'? 'bg-red-600': 'bg-green-600' } w-fit text-white`}>
          {dealt ? 'hold and/or draw': `Result: ${outcome}` }
        </div>

        <div className='p-2 text-lg bg-white w-fit inline text-black rounded-r-2xl'>
          {dealt ? '...' : (parseInt(won) == 0 ? 'You lost!':`You won: ${won}`) }
        </div>

        <div className='p-2 float-right text-lg inline bg-white text-black rounded-l-2xl'>
          <div>Credit: {user_bal}</div>
          <div>position: <span className={pvp.pos_this_session < 0 ? 'text-red-600':'text-green-600'}>{pvp.pos_this_session}</span></div>
        </div>

        <div className='w-2/3 h-60 left-0 right-0 m-auto py-2'>
            <Hand 
            hand={hand}
            dealt={dealt}
            held={held}
            setHeld={setHeld}
            updated={updated}
            dark={dark}/>
        </div>




          <Controls 
            bet={bet} 
            setBet={setBet} 
            dealt={dealt} 
            setDealt={setDealt} 
            need_vk={need_vk} 
            setNeedVk={setNeedVk}
            held={held}
            setHeld={setHeld}
            setOutcome={setOutcome}
            setUpdated={setUpdated}/>
      </div>
      

    </motion.div>
  )
}

export default VideoPoker