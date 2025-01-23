import { ChangeEvent } from "react";
import { motion } from "framer-motion";

interface ColumnProps {
  id: string;
  state: {
    isLocked: boolean;
    count: number;
  };
  label: string;
  onLockToggle: () => void;
  onCountChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    alignItems: 'center',
  },
  label: {
    color: '#0cdcf7',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    textShadow: '0 0 10px rgba(12, 220, 247, 0.3)',
  },
  input: {
    width: '60px',
    padding: '8px',
    textAlign: 'center' as const,
    backgroundColor: 'rgba(10, 25, 47, 0.5)',
    color: '#0cdcf7',
    border: '1px solid rgba(12, 220, 247, 0.3)',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    '&:focus': {
      outline: 'none',
      borderColor: '#0cdcf7',
      boxShadow: '0 0 15px rgba(12, 220, 247, 0.2)',
    },
    '&:hover': {
      borderColor: 'rgba(12, 220, 247, 0.5)',
    },
  },
  lockButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(12, 220, 247, 0.3)',
    borderRadius: '4px',
    padding: '4px 8px',
    color: '#0cdcf7',
    cursor: 'pointer',
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(12, 220, 247, 0.1)',
      boxShadow: '0 0 10px rgba(12, 220, 247, 0.2)',
    },
  },
};

export function Column({ id, state, label, onLockToggle, onCountChange }: ColumnProps) {
  return (
    <div style={styles.container}>
      <motion.span 
        style={styles.label}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {label}
      </motion.span>
      <input
        type="number"
        min="0"
        max="10"
        value={state.count}
        onChange={onCountChange}
        disabled={state.isLocked}
        style={{
          ...styles.input,
          opacity: state.isLocked ? 0.5 : 1,
        }}
      />
      <motion.button
        style={styles.lockButton}
        onClick={onLockToggle}
        whileTap={{ scale: 0.95 }}
      >
        {state.isLocked ? 'Unlock' : 'Lock'}
      </motion.button>
    </div>
  );
} 