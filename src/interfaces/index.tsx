interface Button {
  btnClass: string;
  btnText: string;
  onClick?: () => void;
}

interface GoogleAuth {
  clientId: string;
  clientSecret: string;
}

interface UserInfoProps {
  setDisplayUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

interface folderToggleProps {
  setFolderToggle: React.Dispatch<React.SetStateAction<boolean>>;
  setFolderName: React.Dispatch<React.SetStateAction<string>>;
  uploadFolder: Function;
}

interface folderToggleAndUpload {
  uploadFile: Function;
  setFolderToggle: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PopUpProps {
  isOpen: boolean;
  onClose: () => void;
  setFolderToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FileIcons {
  [key: string]: React.ReactNode;
}

interface ProgressIndicatorProps {
  progress: number[];
  fileName: string[];
  setFileName: React.Dispatch<React.SetStateAction<string[]>>;
}

interface FileListProps {
  folderName: string;
  isFolder: boolean;
  id: string;
  fileLink: string;
  fileName: string;
  isStarred: boolean;
  isTrashed: boolean;
  fileExtension: string;
  folderId: string;
}
interface payloadProps {
  folderName: string;
  isFolder: boolean;
  FileList: object;
}

interface FileDropDownProps {
  file: {
    folderName: string;
    isFolder: boolean;
    isStarred: boolean;
    isTrashed: boolean;
    id: string;
    fileLink: string;
    fileName: string;
    fileExtension: string;
    folderId: string;
  };
  folderId: string;
  isFolderComp: boolean;
  select: string;
  setOpenMenu: React.Dispatch<React.SetStateAction<string>>;
  setRenameToggle: React.Dispatch<React.SetStateAction<string>>;
}

interface renameProps {
  fileExtension: string;
  fileName: string;
  fileId: string;
  isFolder: boolean;
  setRenameToggle: React.Dispatch<React.SetStateAction<string>>;
}
