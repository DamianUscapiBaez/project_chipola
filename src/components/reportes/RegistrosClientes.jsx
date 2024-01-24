import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import Logo from '../../assets/logo.png';
import { useEffect } from "react";

const styles = StyleSheet.create({
    body: {
        paddingBottom: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 18,
        margin: 12,
        fontFamily: 'Oswald',
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Times-Roman',
    },
    image: {
        width: 60,
        height: 60,
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 8,
        bottom: 30,
        left: 0,
        right: 40,
        textAlign: 'right',
        color: 'grey',
    },
});


function compararClientes(clienteA, clienteB) {
    const nombreA = clienteA.namecustomer;
    const nombreB = clienteB.namecustomer;
    return nombreA.localeCompare(nombreB);
}

export const RegistrosClientes = ({ searchRegister, data, clientes, dialogPdfYear }) => {
    // useEffect(() => {
    //     console.log("se genero el pdf");
    // }, []);
    return (
        <Document>
            <Page style={styles.body} orientation="landscape" size="A3">
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '5px' }} fixed>
                    <View>
                        <Image style={styles.image} src={Logo} />
                    </View>
                    <View style={{ marginLeft: '20px' }}>
                        <Text style={{ fontSize: '16px' }}>CHIPOLA</Text>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <Text style={{ fontSize: '16px' }}>
                            REPORTE {searchRegister.typedocument === "F" ? 'FACTURAS ' : 'BOLETAS '}
                            {dialogPdfYear.titulo}
                            {searchRegister.status === "PEN" ? ' (PENDIENTE DE PAGO) ' : ''}
                            {searchRegister.status === "PAG" ? ' (PAGADAS) ' : ''}
                            {searchRegister.status === "ANU" ? ' (ANULADAS) ' : ''}
                        </Text>
                    </View>
                </View>
                {clientes.sort(compararClientes).map((cliente, index) => (
                    <View key={index}>
                        {data.some((d) => d.idcustomer === cliente.idcustomer) && (
                            <View style={{ marginTop: '10px' }}>
                                <View style={{ display: 'flex', flexDirection: 'row', color: '#fff', backgroundColor: "#2a8038", paddingTop: "10px", paddingBottom: '5px' }}>
                                    <View style={{ display: 1, width: '5px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}></Text>
                                    </View>
                                    <View style={{ display: 2, width: '350px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}>CLIENTE</Text>
                                    </View>
                                    <View style={{ display: 3, width: '350px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}>NOMBRE COMERCIAL</Text>
                                    </View>
                                    <View style={{ display: 4, width: '100px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}>NUMERO</Text>
                                    </View>
                                    <View style={{ display: 5, width: '120px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}>FECHA</Text>
                                    </View>
                                    <View style={{ display: 6, width: '120px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}>FECHA VENCIMIENTO</Text>
                                    </View>
                                    <View style={{ display: 7, width: '120px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>DIAS VENCIMIENTO</Text>
                                    </View>
                                    <View style={{ display: 8, width: '100px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>KILOS</Text>
                                    </View>
                                    <View style={{ display: 9, width: '100px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>MONTO PAGO</Text>
                                    </View>
                                    <View style={{ display: 10, width: '100px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>DEUDA</Text>
                                    </View>
                                    <View style={{ display: 11, width: '100px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>ESTADO</Text>
                                    </View>
                                    <View style={{ display: 12, width: '5px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}></Text>
                                    </View>
                                </View>
                                {data
                                    .filter((d) => d.idcustomer === cliente.idcustomer)
                                    .map((d, index) => (
                                        <View key={index} style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#EBF8FF', padding: "4px 0" }}>
                                            <View style={{ display: 1, width: '5px', margin: '2px' }}>
                                                <Text style={{ fontSize: '7.5px' }}></Text>
                                            </View>
                                            <View style={{ display: 2, width: '350px', margin: '2px' }}>
                                                <Text style={{ fontSize: '7.5px' }}>{d.cliente}</Text>
                                            </View>
                                            <View style={{ display: 3, width: '350px', margin: '2px' }}>
                                                <Text style={{ fontSize: '7.5px' }}>{d.tradename}</Text>
                                            </View>
                                            <View style={{ display: 4, width: '100px', margin: '2px' }}>
                                                <Text style={{ fontSize: '7.5px' }}>{d.numero}</Text>
                                            </View>
                                            <View style={{ display: 5, width: '120px ', margin: '2px' }}>
                                                <Text style={{ fontSize: '7.5px' }}>{d.fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}</Text>
                                            </View>
                                            <View style={{ display: 6, width: '120px', margin: '2px' }}>
                                                <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>
                                                    {d.fechavencimiento.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}
                                                </Text>
                                            </View>
                                            <View style={{ display: 7, width: '120px', margin: '2px' }}>
                                                <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{d.diasvencidos}</Text>
                                            </View>
                                            <View style={{ display: 8, width: '100px', margin: '2px' }}>
                                                <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{d.kilos}</Text>
                                            </View>
                                            <View style={{ display: 9, width: '100px', margin: '2px' }}>
                                                <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{(parseFloat(d.montopago) + parseFloat(d.montopago2)).toFixed(2)}</Text>
                                            </View>
                                            <View style={{ display: 10, width: '100px', margin: '2px' }}>
                                                <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{d.deuda}</Text>
                                            </View>
                                            <View style={{ display: 11, width: '100px', margin: '2px' }}>
                                                <Text style={{ fontSize: '8pt', textAlign: 'right' }}>
                                                    {d.estado === 'PEN' ? 'PENDIENTE' : (d.estado === 'PAG' ? 'PAGADO' : 'ANULADO')}
                                                </Text>
                                            </View>
                                            <View style={{ display: 12, width: '5px', margin: '2px' }}>
                                                <Text style={{ fontSize: '7.5px' }}></Text>
                                            </View>
                                            <br />
                                        </View>
                                    ))
                                }
                                <View style={{ display: 'flex', flexDirection: 'row', color: '#fff', backgroundColor: "#2a8038", padding: "4px 0" }}>
                                    <View style={{ display: 1, width: '5px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}></Text>
                                    </View>
                                    <View style={{ display: 2, width: '350px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}>TOTAL</Text>
                                    </View>
                                    <View style={{ display: 3, width: '350px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}></Text>
                                    </View>
                                    <View style={{ display: 4, width: '100px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}></Text>
                                    </View>
                                    <View style={{ display: 5, width: '120px ', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}></Text>
                                    </View>
                                    <View style={{ display: 6, width: '120px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}></Text>
                                    </View>
                                    <View style={{ display: 7, width: '120px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}></Text>
                                    </View>
                                    <View style={{ display: 8, width: '100px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{data.filter((d) => d.idcustomer === cliente.idcustomer).reduce((total, item) => parseFloat(total) + parseFloat(item.kilos), 0).toFixed(2)}</Text>
                                    </View>
                                    <View style={{ display: 9, width: '100px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{data.filter((d) => d.idcustomer === cliente.idcustomer).reduce((total, item) => parseFloat(total) + parseFloat(item.montopago) + parseFloat(item.montopago2), 0).toFixed(2)}</Text>
                                    </View>
                                    <View style={{ display: 10, width: '100px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{data.filter((d) => d.idcustomer === cliente.idcustomer).reduce((total, item) => parseFloat(total) + parseFloat(item.deuda), 0).toFixed(2)}</Text>
                                    </View>
                                    <View style={{ display: 11, width: '100px', margin: '2px' }}>
                                    </View>
                                    <View style={{ display: 12, width: '5px', margin: '2px' }}>
                                        <Text style={{ fontSize: '7.5px' }}></Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                ))}
                <Text style={styles.pageNumber} render={({ pageNumber }) => `Pag ${pageNumber}`} fixed />
            </Page>
        </Document>
    );
}
