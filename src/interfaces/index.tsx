interface Button {
  btnClass: string;
  btnText: string;
  onClick?: () => void;
}

interface GithubAuth {
  clientId: string;
  clientSecret: string;
}

interface UserInfoProps {
  setDisplayUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AddNewFolderProps {
  setAddNewFolder: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AddNewFolderAndUpload extends AddNewFolderProps {
  uploadFile: Function;
  setIsDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PopUpProps {
  isOpen: boolean;
  onClose: () => void;
  setAddNewFolder: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProgressIndicatorProps {
  progress: number[];
  fileName: string[];
  setFileName: React.Dispatch<React.SetStateAction<string[]>>;
}

interface FileListProps {
  id: string;
  fileLink: string;
  fileName: string;
  fileExtension: string;
}
