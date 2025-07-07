import { useContext } from 'react';
import { GroupContext } from '../context/GroupContext';

const useGroups = () => useContext(GroupContext);

export default useGroups; 