import React, { useEffect, useState } from 'react';
import { DownloadRounded, InsertDriveFileRounded, LogoutRounded } from '@mui/icons-material';
import BaseModal from '../../modals/BaseModal';
import ExportModal from '../../modals/ExportModal';

type OptionsMenuProps = {
  page: string,
  buttonRef: React.RefObject<HTMLDivElement>,
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

type OptionsMenuItemProps = {
  icon: React.ReactNode,
  name: string,
  onClick: () => void,
};

const OptionsMenuItem = (props: OptionsMenuItemProps) => {
  const {
    icon,
    name,
    onClick,
  } = props;
  
  return (
    <div
      className="flex flex-row items-center text-center gap-2 p-2 rounded cursor-pointer hover:bg-stone-200 dark:hover:bg-neutral-500"
      onClick={onClick}
    >
      {icon}
      <span>{name}</span>
    </div>
  );
}

const OptionsMenu = (props: OptionsMenuProps) => {
  const {
    page,
    buttonRef,
    setIsMenuOpen,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modal, setModal] = useState<React.ReactNode>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current
        && !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  if (isModalOpen) {
    return modal;
  }

  return (
    <div
      className={`
        absolute -bottom-2 right-1 z-20
        flex flex-col w-72 p-3
        translate-y-full
        border border-black rounded-md opacity-100 h-max
        text-zinc-700 dark:text-amber-50 bg-stone-100 dark:bg-neutral-600 border-opacity-5
        print:hidden
      `}
    >
      <p className="text-lg font-bold">Options</p>

      <OptionsMenuItem
        icon={<DownloadRounded />}
        name="Import"
        onClick={() => {}}
      />
      <OptionsMenuItem
        icon={<InsertDriveFileRounded />}
        name="Export"
        onClick={async () => {
          setIsModalOpen(true);
          setModal(
            <ExportModal
              setIsOpen={setIsModalOpen}
            />,
          );
          // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/export/${page}?format=md`)

          // const fileName = res.headers.get('Content-Disposition')?.split('filename=')[1];

          // const blob = await res.blob();

          // const url = window.URL.createObjectURL(blob);
          // const a = document.createElement('a');
          // a.href= url;
          // a.download = fileName || 'page.md';
          // document.body.appendChild(a);
          // a.click();
          // a.remove();
        }}
      />
      <OptionsMenuItem
        icon={<LogoutRounded />}
        name="Logout"
        onClick={() => {}}
      />
    </div>
  );
};

export default OptionsMenu;
