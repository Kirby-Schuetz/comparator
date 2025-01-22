import { styles } from '../ControlPanel.styles';

interface ColumnProps {
  id: 'left' | 'right';
  state: {
    isLocked: boolean;
    count: number;
  };
  onLockToggle: () => void;
  onCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Column = ({ 
  id, 
  state, 
  onLockToggle, 
  onCountChange,
}: ColumnProps) => (
  <div style={styles.column}>
    <button
      onClick={onLockToggle}
      style={{
        ...styles.buttonStyle,
        backgroundColor: state.isLocked ? '#ff0088' : '#0cdcf7',
      }}
    >
      <label style={styles.label} htmlFor={`${id}ColumnInput`}>
        {state.isLocked ? 'Label' : 'Input'}
      </label>
    </button>
    <input
      id={`${id}ColumnInput`}
      type="text"
      value={state.count}
      onChange={onCountChange}
      style={styles.input}
      min={0}
      max={10}
      placeholder="Enter number of blocks"
      readOnly={state.isLocked}
    />
  </div>
); 