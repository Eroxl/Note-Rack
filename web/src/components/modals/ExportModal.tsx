import React, { useState } from 'react';
import { useRouter } from 'next/router';

import BaseModal from './BaseModal';
import DropDown from '../menus/DropDown';

type ExportModalProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
};

const FORMAT_OPTIONS = [
  {
    title: 'PDF',
  },
  {
    title: 'Markdown',
  }
];

const ExportModal: React.FC<ExportModalProps> = (props) => { 
  const { setIsOpen } = props;

  const [currentSelectedFormat, setCurrentSelectedFormat] = useState(0);
  const [includeSubPages, setIncludeSubPages] = useState(false);
  const { page } = useRouter().query;

  return (
    <BaseModal
      isOpen={true}
      setIsOpen={setIsOpen}
    >
      <div className="px-4 flex flex-col w-screen max-w-xs gap-2 p-2 rounded-lg bg-zinc-700 text-white/50">
        <DropDown
          name="Export format"
          options={FORMAT_OPTIONS}
          setSelectedDropdownOption={setCurrentSelectedFormat}
          selectedDropdownOption={currentSelectedFormat}
        />
      </div>
    </BaseModal>
  );
};

export default ExportModal
