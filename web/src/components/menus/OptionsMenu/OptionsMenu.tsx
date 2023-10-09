import React, { useEffect, useState } from 'react';
import { DownloadRounded, InsertDriveFileRounded, LogoutRounded } from '@mui/icons-material';
import ExportModal from '../../modals/ExportModal';
import { signOut } from "supertokens-auth-react/recipe/thirdparty";

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

const OptionsMenuItem: React.FC<OptionsMenuItemProps> = (props) => {
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

const OptionsMenu: React.FC<OptionsMenuProps> = (props) => {
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
    return (
      <>
        {modal}
      </>
    );
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
        }}
      />
      <OptionsMenuItem
        icon={<LogoutRounded />}
        name="Logout"
        onClick={async () => {
          await signOut();

          localStorage.removeItem('latestPageID');
          window.location.href = '/';
        }}
      />
    </div>
  );
};

export default OptionsMenu;
