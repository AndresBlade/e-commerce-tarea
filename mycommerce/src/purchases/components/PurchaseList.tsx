import { useState, useEffect } from 'react';
import { Purchase } from '../../purchases/interfaces/Purchase';
import { useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { getPurchasesByUser } from '../helpers/getPurchasesByUser';
import { PurchaseCard } from './PurchaseCard';

export const PurchaseList = () => {
	const [purchases, setPurchases] = useState<Purchase[] | null>(null);
	const {
		userData: {
			token,
			user: { id },
		},
	} = useContext(AuthContext);
	useEffect(() => {
		getPurchasesByUser(id, token)
			.then(response => setPurchases(response))
			.catch(err => console.log(err));
	});
	return (
		<div className="compras__flex">
			{purchases?.map(purchase => (
				<PurchaseCard {...purchase} />
			))}
		</div>
	);
};
