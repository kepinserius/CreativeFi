// backend/src/services/contractService.ts
import Web3 from 'web3';
import { ProjectModel } from '../models/Project';
import { UserModel } from '../models/User';

// ABI untuk smart contract (akan diambil dari artifacts setelah kompilasi)
const projectFactoryABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "_platformFeePercentage", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_title", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "string", "name": "_category", "type": "string" },
      { "internalType": "uint256", "name": "_fundingGoal", "type": "uint256" },
      { "internalType": "uint256", "name": "_deadline", "type": "uint256" },
      { "internalType": "address", "name": "_usdcToken", "type": "address" },
      { "internalType": "address", "name": "_usdtToken", "type": "address" },
      { "internalType": "uint256", "name": "_creatorPercentage", "type": "uint256" },
      { "internalType": "uint256", "name": "_platformPercentage", "type": "uint256" },
      { "internalType": "uint256", "name": "_emergencyThreshold", "type": "uint256" }
    ],
    "name": "createProject",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }],
    "name": "getProject",
    "outputs": [
      { "internalType": "address", "name": "projectAddress", "type": "address" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "address", "name": "creator", "type": "address" },
      { "internalType": "uint256", "name": "fundingGoal", "type": "uint256" },
      { "internalType": "uint256", "name": "totalRaised", "type": "uint256" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" },
      { "internalType": "bool", "name": "isActive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const creatorProjectABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "invest",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "title",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "description",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fundingGoal",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRaised",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "investorCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

class ContractService {
  private web3: Web3;
  private projectFactoryAddress: string;
  private projectFactoryContract: any;

  constructor() {
    // Dapatkan URL provider dari env, default ke localhost
    const providerUrl = process.env.WEB3_PROVIDER_URL || 'http://localhost:8545';
    this.web3 = new Web3(providerUrl);
    
    // Ambil alamat kontrak dari env
    this.projectFactoryAddress = process.env.PROJECT_FACTORY_ADDRESS || '';
    
    // Inisialisasi kontrak
    if (this.projectFactoryAddress) {
      this.projectFactoryContract = new this.web3.eth.Contract(projectFactoryABI, this.projectFactoryAddress);
    }
  }

  // Buat project baru di smart contract
  async createProjectOnContract(
    title: string,
    description: string,
    category: string,
    fundingGoal: string, // dalam wei
    deadline: number, // timestamp
    usdcToken: string,
    usdtToken: string,
    creatorPercentage: number,
    platformPercentage: number,
    emergencyThreshold: number,
    creatorAddress: string
  ): Promise<string> {
    try {
      if (!this.projectFactoryContract) {
        throw new Error('ProjectFactory contract not initialized');
      }

      // Konversi funding goal ke format yang benar
      const fundingGoalBN = this.web3.utils.toWei(fundingGoal, 'wei');

      // Siapkan data untuk transaksi
      const encodedABI = this.projectFactoryContract.methods
        .createProject(
          title,
          description,
          category,
          fundingGoalBN,
          deadline,
          usdcToken,
          usdtToken,
          creatorPercentage,
          platformPercentage,
          emergencyThreshold
        )
        .encodeABI();

      // Kirim transaksi
      const gasEstimate = await this.projectFactoryContract.methods
        .createProject(
          title,
          description,
          category,
          fundingGoalBN,
          deadline,
          usdcToken,
          usdtToken,
          creatorPercentage,
          platformPercentage,
          emergencyThreshold
        )
        .estimateGas({ from: creatorAddress });

      const receipt = await this.web3.eth.sendTransaction({
        from: creatorAddress,
        to: this.projectFactoryAddress,
        data: encodedABI,
        gas: Math.floor(gasEstimate * 1.2), // Add 20% buffer
        gasPrice: await this.web3.eth.getGasPrice()
      });

      // Ekstrak alamat proyek dari log transaksi
      // Ini akan tergantung pada event yang dihasilkan kontrak
      // Kita asumsikan event ProjectCreated mengandung alamat proyek baru
      if (receipt.events && receipt.events.ProjectCreated) {
        return receipt.events.ProjectCreated.returnValues.projectAddress as string;
      } else {
        // Jika tidak ada event, kita perlu cara lain untuk mendapatkan alamat
        // Misalnya dengan memanggil fungsi getProject untuk projectId terakhir
        // Ini adalah workaround sementara
        throw new Error('ProjectCreated event not found in transaction receipt');
      }
    } catch (error) {
      console.error('Error creating project on contract:', error);
      throw error;
    }
  }

  // Ambil informasi proyek dari smart contract
  async getProjectFromContract(contractAddress: string): Promise<any> {
    try {
      const contract = new this.web3.eth.Contract(creatorProjectABI, contractAddress);
      
      const title = await contract.methods.title().call() as string;
      const description = await contract.methods.description().call() as string;
      const fundingGoal = await contract.methods.fundingGoal().call() as string;
      const totalRaised = await contract.methods.totalRaised().call() as string;
      const investorCount = await contract.methods.investorCount().call() as string;

      return {
        title,
        description,
        fundingGoal: this.web3.utils.fromWei(fundingGoal, 'ether').toString(),
        totalRaised: this.web3.utils.fromWei(totalRaised, 'ether').toString(),
        investorCount: parseInt(investorCount)
      };
    } catch (error) {
      console.error('Error getting project from contract:', error);
      throw error;
    }
  }

  // Sinkronkan data dari smart contract ke database
  async syncProjectData(contractAddress: string): Promise<void> {
    try {
      const contractData = await this.getProjectFromContract(contractAddress);
      
      // Dapatkan data proyek dari database
      const project = await ProjectModel.findByContractAddress(contractAddress);
      if (!project) {
        throw new Error('Project not found in database');
      }

      // Update data proyek di database berdasarkan data dari smart contract
      await ProjectModel.updateById(project.id, {
        total_raised: parseFloat(contractData.totalRaised),
        investor_count: contractData.investorCount
      });
    } catch (error) {
      console.error('Error syncing project data:', error);
      throw error;
    }
  }

  // Validasi bahwa kontrak proyek valid
  async isValidProjectContract(contractAddress: string): Promise<boolean> {
    try {
      const contract = new this.web3.eth.Contract(creatorProjectABI, contractAddress);
      
      // Coba panggil fungsi view sederhana untuk validasi
      const titleResult: any = await contract.methods.title().call();
      const title: string = typeof titleResult === 'string' ? titleResult : '';
      return Boolean(title && title.length > 0);
    } catch (error) {
      console.error('Error validating project contract:', error);
      return false;
    }
  }

  // Fungsi utilitas untuk mengonversi ke Wei
  toWei(value: string, unit: 'ether' | 'wei' | 'gwei' | 'mwei' | 'kwei' | 'noether' | 'lovelace' | 'shannon' | 'szabo' | 'finney' | 'babbage' | 'picoether' | 'nanoether' | 'microether' | 'milliether' | 'ether' | 'kether' | 'mether' | 'gether' | 'tether' = 'ether'): string {
    return this.web3.utils.toWei(value, unit);
  }

  // Fungsi utilitas untuk mengonversi dari Wei
  fromWei(value: string, unit: 'ether' | 'wei' | 'gwei' | 'mwei' | 'kwei' | 'noether' | 'lovelace' | 'shannon' | 'szabo' | 'finney' | 'babbage' | 'picoether' | 'nanoether' | 'microether' | 'milliether' | 'ether' | 'kether' | 'mether' | 'gether' | 'tether' = 'ether'): string {
    return this.web3.utils.fromWei(value, unit);
  }
}

export default new ContractService();