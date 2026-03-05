import { CustomerOrder, CustomerOrder_ProductPrint } from "../hooks/useInventory";

const printOrder = (order: CustomerOrder, products: CustomerOrder_ProductPrint[]) => {

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
        <html>
          <head>
            <title>Pedido ${order.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .details { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Pedido #${order.id}</h1>
              <p>Fecha: ${new Date(order.orderDate).toLocaleDateString('es-PE')}</p>
            </div>
            <div class="details">
              <h3>Cliente:</h3>
              <p><strong>Nombre:</strong> ${order.customerName}</p>
              <p><strong>Email:</strong> ${order.customerEmail}</p>
              <p><strong>Teléfono:</strong> ${order.customerPhone || 'N/A'}</p>
              <p><strong>Dirección:</strong> ${order.customerAddress || 'N/A'}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${products.map((p: any) => {
            return `
                    <tr>
                      <td>${p?.name || 'Producto desconocido'}</td>
                      <td>${p.quantity}</td>
                      <td>S/ ${p.price.toFixed(2)}</td>
                      <td>S/ ${(p.quantity * p.price).toFixed(2)}</td>
                    </tr>
                  `;
        }).join('')}
              </tbody>
            </table>
            <div style="margin-top: 20px; text-align: right;">
              <p><strong>Envío: S/ ${order.shippingCost.toFixed(2)}</strong></p>
              <p><strong>Total: S/ ${order.total.toFixed(2)}</strong></p>
            </div>
          </body>
        </html>
      `);
        printWindow.document.close();
        printWindow.print();
    }
}

export {
    printOrder,
}