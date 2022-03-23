import * as algo from './tuiterAlgorithm';
import Tuit from "../../models/tuits/Tuit";
import User from "../../models/users/User";

const user: User = {username: 'alice', password: 'alice123', email: 'alice@wonderland.com'};

test('Algorithm correctly selects latest tuits', () => {
    // generate 100 random tuits with random postedOn dates
    const tuits: Tuit[] = [];
    const SIZE = 100;
    // for(let i=0; i<SIZE; i++) {
    //    
    //     const newTuit: Tuit = {
    //        
    //     }
    // }
});