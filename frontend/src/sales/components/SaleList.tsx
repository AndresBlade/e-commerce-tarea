import { Shop } from '../../shops/interfaces/Shop';
import { useState, useEffect, Fragment } from 'react';
import { ProductSold } from '../interfaces/ProductSold';
import { getProductsSoldByRIF } from '../helpers/getProductsSoldByShop';
import { useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { SaleCard } from './SaleCard';

export const SaleList = ({ nombre, RIF }: Shop) => {
	const [ProductsSold, setProductsSold] = useState<ProductSold[] | []>([]);

	const {
		user: { token },
	} = useContext(AuthContext);

	useEffect(() => {
		getProductsSoldByRIF(RIF.toString(), token)
			.then(response => setProductsSold(response))
			.catch(err => console.log(err));
	}, [RIF, token]);

	return (
		<div className="bg-blanco flex flex-col items-center p-5 rounded-t-md shadow-md">
			<h2>{nombre}</h2>
			{ProductsSold.length > 0 && (
				<div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{ProductsSold.filter(
						product => product.ProductosVendidos.length > 0
					).map(product => (
						<Fragment key={product.id}>
							{product.ProductosVendidos.map(
								(productSold, index) => (
									<SaleCard
										productSold={product}
										saleDetails={productSold}
										key={index}
									/>
								)
							)}
						</Fragment>
					))}
				</div>
			)}
		</div>
	);
};
