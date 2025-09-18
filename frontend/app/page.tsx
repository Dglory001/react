

"use client"

import api from "@/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowUpCircle, ArrowDownCircle, Wallet, Activity, TrendingUp, TrendingDown, Trash, PlusCircle, Plus } from "lucide-react";


type Transaction = {
  id : string;
  text : string;
  amount : number;
  create_at : string;
}


export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [text, setText] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading , setLoading] = useState(false)


  const getTransactions = async () => {
    try {
      const res = await api.get<Transaction[]>("transactions/")
      setTransactions(res.data)
      toast.success("Transactions chargées")
    } catch (error) {
      console.error("Erreur lors du chargement des transactions :", error)
      toast.error("Erreur lors du chargement des transactions")
    }
    
  }



  
  const deleteTransactions = async (id : string) => {
    try {
      const res = await api.delete(`transactions/${id}/`)
      getTransactions()
      toast.success("Transaction supprimée avec succès")
    } catch (error) {
      console.error("Erreur suppression transaction :", error)
      toast.error("Erreur suppression transaction")
    }
    
  }



    
  const addTransactions = async () => {
    if(!text || amount === "" || isNaN(Number(amount))) {
      toast.error("Merci de remplir texte et montant valides");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post<Transaction>(`transactions/`, { 
        text, 
        amount : Number(amount)
      })
      getTransactions()
      const modal = document.getElementById('my_modal_3') as HTMLDialogElement
      if(modal) {
        modal.close()
      }

      toast.success("Transaction ajoutée avec succès")
      setText("")
      setAmount("")
    } catch (error) {
      console.error("Erreur ajout transaction :", error);
      toast.error("Erreur ajout transaction")

    }finally {
      setLoading(false)
    }
  }







  
  useEffect(() => {
    getTransactions()
  }, []);

  const amounts = transactions.map((t) =>Number(t.amount) || 0)
  const balance = amounts.reduce((acc , item)  => acc + item , 0) || 0
  const income = 
      amounts.filter((a) => a > 0).reduce((acc , item)  => acc + item , 0) || 0


  const expense = 
      amounts.filter((a) => a < 0).reduce((acc , item)  => acc + item , 0) || 0

  
  const ratio = income > 0 ? Math.min(Math.abs(expense) / income * 100, 100) : 0

  interface FormatDateOptions extends Intl.DateTimeFormatOptions {
    year: "numeric";
    month: "short";
    day: "numeric";
    hour: "2-digit";
    minute: "2-digit";
  }

  const formatDate = (dateString: string | undefined): string => {
    console.log("Date string reçue:", dateString); // 👈 Ajouté
    if (!dateString) {
      return "Date non disponible";
    }
    const date = new Date(dateString);
    const options: FormatDateOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = date.toLocaleString(undefined, options);
    console.log("Date formatée:", formattedDate); // 👈 Ajouté
    return formattedDate;
  };

  

  return (
    <div className="w-2/3 flex flex-col gap-4">
      <div className="flex justify-between rounded-2Xl border-2 border-warning/10 
      border-dashed bg-warning/5 p-5">


             <div className="flex  flex-col gap-1">
                <div className="badge badge-soft">
                  <Wallet  className="w-4 h-4"/>
                  Votre solde 
                </div>
                <div className="stat-value">
                  {balance.toFixed(2)} £
                </div>
             </div>
            
             <div className="flex  flex-col gap-1">
                <div className="badge badge-soft badge-success">
                  <ArrowUpCircle  className="w-4 h-4"/>
                  Revenus
                </div>
                <div className="stat-value">
                  {income.toFixed(2)} £
                </div>
             </div>


             <div className="flex  flex-col gap-1">
                <div className="badge badge-soft badge-error">
                  <ArrowDownCircle  className="w-4 h-4"/>
                  Dépenses
                </div>
                <div className="stat-value">
                  {expense.toFixed(2)} £
                </div>
             </div>

      </div>
      <br />
      <div className="rounded-2Xl border-2 border-warning/10 
      border-dashed bg-warning/5 p-5">
        <div className="flex justify-between items-center mb-1">
          <div className="badge badge-soft badge-warning gap-1">
            <Activity className="w-4 h-4"/>
            Dépenses vs Revenus
          </div>
          <div className="stat-value"> 
            {ratio.toFixed(0)}%
          </div>
         </div> 
        

        <progress 
        className="progress progress-warning" w-full
        value={ratio}
        max={100} >
 

        </progress>
      





      </div>



   {/* You can open the modal using document.getElementById('ID').showModal() method */}
<button className="btn btn-warning" 
onClick={()=> (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
  <PlusCircle  className="w-4 h-4"/>
Ajouter une transaction
</button>




      <div className="overflow-x-auto rounded-2Xl border-2 border-warning/10 
      border-dashed bg-warning/5 ">
        <table className="table">
            {/* head */}
            <thead>
               <tr>
                 <th>#</th>
                 <th>Description</th>
                 <th>Montant</th>
                 <th>Date</th>
                 <th>Action</th>
               </tr>
            </thead>
            <tbody>
    
     {transactions.map((t, index) => (

      <tr key={t.id}>
        <th>{index + 1}</th>
        <td>{t.text}</td>
        <td className="font-semibold flex items-center gap-2">
          {t.amount > 0 ? (
            <TrendingUp className="text-success w-6 h-6" />
          ) : (
            <TrendingDown className="text-error text-red-500 w-6 h-6" />
          )}
          {t.amount > 0 ? `+${t.amount}` : `${t.amount}`}
        </td>
        <td>
          {formatDate(t.create_at || t.created_at || t.date)}
        </td>
        <td>
          <button 
          onClick={() => deleteTransactions(t.id)}
          className="btn btn-sm btn-error btn-soft"
          title="supprimer"
          >
            <Trash className="w-4 h-4"/>
          </button>
        </td>
      </tr>
     ))}

    </tbody>
  </table>
</div>


<dialog id="my_modal_3" className="modal backdrop-blur-sm">
  <div className="modal-box border-2 border-warning/50 border-dashed">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 className="font-bold text-lg">Ajouter une transaction</h3>

    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-2">
        <label className="label">Texte</label>
        <input 
          type="text" 
          name="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Entrez le texte..."
          className="input  w-full "
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="label">Montant (négatif - dépense, positif - revenu)</label>
        <input 
          type="number" 
          name="amount" 
          value={amount}
          onChange={(e) => setAmount(
            e.target.value === "" ? "" : Number(e.target.value)
          )}
          placeholder="Entrez le montant..."
          className="input  w-full "
        />
      </div>
     <button
        type="button"
        className="w-full btn btn-warning"
        onClick={addTransactions}
        disabled={loading}
      >
     <PlusCircle className="w-4 h-4"/>
       Ajouter
    </button>

    </div>
  </div>

</dialog>

    </div>
  );
}
