import React, { useState } from 'react';
import { useRouter } from 'next/router';

import BaseModal from './BaseModal';
import DropDown from '../menus/DropDown';
import Button from '../menus/Button';

type ExportModalProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
};

const FORMAT_OPTIONS = [
  {
    title: 'PDF',
    shorthand: 'pdf',
  },
  {
    title: 'Markdown',
    shorthand: 'md',
  }
];

const ExportModal: React.FC<ExportModalProps> = (props) => { 
  const { setIsOpen } = props;

  const [currentSelectedFormat, setCurrentSelectedFormat] = useState(0);
  
  const page = useRouter().query.page as string;

  return (
    <BaseModal
      isOpen={true}
      setIsOpen={setIsOpen}
    >
      <div className="p-4 flex flex-col w-screen max-w-xs gap-2 rounded-lg bg-zinc-700 text-white/50">
        <DropDown
          name="Export format"
          options={FORMAT_OPTIONS}
          setSelectedDropdownOption={setCurrentSelectedFormat}
          selectedDropdownOption={currentSelectedFormat}
        />

        <div className="flex flex-row-reverse">
          <Button
            label="Export"
            style="primary"
            onClick={async () => {
              if (FORMAT_OPTIONS[currentSelectedFormat].shorthand === 'pdf') {
                window.print();

                return;
              };

              const format = FORMAT_OPTIONS[currentSelectedFormat].shorthand;

              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/export/${page}?format=${format}`);

              const fileName = res.headers.get('Content-Disposition')?.split('filename=')[1];

              const blob = await res.blob();

              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href= url;
              a.download = fileName || 'page.md';
              document.body.appendChild(a);
              a.click();
              a.remove();
            }}
          />
          <Button
            label="Cancel"
            style="secondary"
            onClick={() => {
              setIsOpen(false);
            }}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default ExportModal
