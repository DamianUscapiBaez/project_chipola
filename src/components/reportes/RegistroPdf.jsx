import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import Logo from '../../assets/logo.png';

export const RegistroPdf = ({ searchRegister, data }) => {
    const styles = StyleSheet.create({
        body: {
            // paddingTop: 0,
            paddingBottom: 50,
            paddingHorizontal: 20,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold'
        },
        author: {
            fontSize: 12,
            textAlign: 'center',
            marginBottom: 40,
        },
        subtitle: {
            fontSize: 18,
            margin: 12,
            fontFamily: 'Oswald'
        },
        text: {
            margin: 12,
            fontSize: 14,
            textAlign: 'justify',
            fontFamily: 'Times-Roman'
        },
        image: {
            marginVertical: 10,
            marginHorizontal: 50,
            width: '45px',
            height: '45px'
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
    const estilosTablaPdf = { padding: "4px 0" }
    // const reporte
    return (
        <Document>
            <Page style={styles.body} orientation="landscape" size={"A3"}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px' }} fixed>
                    <View>
                        <Image style={{ width: '60px', height: '60px' }} src={Logo} />
                    </View>
                    <View style={{ marginLeft: '20px' }}>
                        <Text style={{ fontSize: '16px' }}>CHIPOLA</Text>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <Text style={{ fontSize: '16px' }}>
                            REPORTE {searchRegister.typedocument === "F" ? 'FACTURAS ' : 'BOLETAS '}
                            -
                            {' ' + searchRegister.year}
                            {searchRegister.status === "PEN" ? ' (PENDIENTE DE PAGO) ' : ''}
                            {searchRegister.status === "PAG" ? ' (PAGADAS) ' : ''}
                            {searchRegister.status === "ANU" ? ' (ANULADAS) ' : ''}
                        </Text>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', color: '#fff', backgroundColor: "#2a8038", paddingTop: "5px", paddingBottom: '5px' }} fixed>
                    <View style={{ display: 1, width: '5px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                    <View style={{ display: 2, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>NUMERO</Text>
                    </View>
                    <View style={{ display: 3, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>FECHA</Text>
                    </View>
                    <View style={{ display: 3, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>FECHA VENCIMIENTO</Text>
                    </View>
                    <View style={{ display: 4, width: '300px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>CLIENTE</Text>
                    </View>
                    <View style={{ display: 5, width: '300px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>NOMBRE COMERCIAL</Text>
                    </View>
                    <View style={{ display: 6, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>KILOS</Text>
                    </View>
                    <View style={{ display: 7, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>MONTO</Text>
                    </View>
                    <View style={{ display: 8, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>MONTO PAGO</Text>
                    </View>
                    <View style={{ display: 9, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>DEUDA</Text>
                    </View>
                    <View style={{ display: 10, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>ESTADO</Text>
                    </View>
                    <View style={{ display: 11, width: '5px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                </View>
                {
                    data.map((r, index) => (
                        <View key={index} style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#EBF8FF', padding: estilosTablaPdf.padding }}>
                            <View style={{ display: 1, width: '5px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}></Text>
                            </View>
                            <View style={{ display: 2, width: '100px', margin: '2px' }}>
                                <Text style={{ fontSize: '8pt' }}>{r.numero}</Text>
                            </View>
                            <View style={{ display: 3, width: '100px', margin: '2px' }}>
                                <Text style={{ fontSize: '8pt' }}>{r.fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}</Text>
                            </View>
                            <View style={{ display: 3, width: '100px', margin: '2px' }}>
                                <Text style={{ fontSize: '8pt' }}>{r.fechavencimiento.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}</Text>
                            </View>
                            <View style={{ display: 4, width: '300px', margin: '2px' }}>
                                <Text style={{ fontSize: '8pt' }}>{r.cliente}</Text>
                            </View>
                            <View style={{ display: 5, width: '300px', margin: '2px' }}>
                                <Text style={{ fontSize: '8pt' }}>{r.tradename}</Text>
                            </View>
                            <View style={{ display: 6, width: '70px', margin: '2px' }}>
                                <Text style={{ fontSize: '8pt', textAlign: 'right' }}>{r.kilos}</Text>
                            </View>
                            <View style={{ display: 7, width: '100px', margin: '2px' }}>
                                <Text style={{ fontSize: '8pt', textAlign: 'right' }}>{r.monto}</Text>
                            </View>
                            <View style={{ display: 8, width: '100px', margin: '2px' }}>
                                <Text style={{ fontSize: '8pt', textAlign: 'right' }}>{r.montopago}</Text>
                            </View>
                            <View style={{ display: 9, width: '100px', margin: '2px' }}>
                                <Text style={{ fontSize: '8pt', textAlign: 'right' }}>{r.deuda}</Text>
                            </View>
                            <View style={{ display: 10, width: '100px', margin: '2px' }}>
                                <Text style={{ fontSize: '8pt', textAlign: 'right' }}>
                                    {r.estado === 'PEN' ? 'PENDIENTE' : (r.estado === 'PAG' ? 'PAGADO' : 'ANULADO')}
                                </Text>
                            </View>
                            <View style={{ display: 11, width: '5px', margin: '2px' }}>
                                <Text style={{ fontSize: '7.5px' }}></Text>
                            </View>
                            <br />
                        </View>
                    ))
                }
                <View style={{ display: 'flex', flexDirection: 'row', color: '#fff', backgroundColor: "#2a8038", padding: "4px 0" }} fixed>
                    <View style={{ display: 1, width: '5px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                    <View style={{ display: 2, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}>TOTAL</Text>
                    </View>
                    <View style={{ display: 3, width: '300px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}></Text>
                    </View>
                    <View style={{ display: 4, width: '300px', margin: '2px' }}>
                        <Text style={{ fontSize: '8pt' }}></Text>
                    </View>
                    <View style={{ display: 5, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}></Text>
                    </View>
                    <View style={{ display: 6, width: '70px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}></Text>
                    </View>
                    <View style={{ display: 7, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{data.reduce((total, item) => parseFloat(total) + parseFloat(item.kilos), 0).toFixed(2)}</Text>
                    </View>
                    <View style={{ display: 8, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{data.reduce((total, item) => parseFloat(total) + parseFloat(item.monto), 0).toFixed(2)}</Text>
                    </View>
                    <View style={{ display: 9, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{data.reduce((total, item) => parseFloat(total) + parseFloat(item.montopago), 0).toFixed(2)}</Text>
                    </View>
                    <View style={{ display: 10, width: '100px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px', textAlign: 'right' }}>{data.reduce((total, item) => parseFloat(total) + parseFloat(item.deuda), 0).toFixed(2)}</Text>
                    </View>
                    <View style={{ display: 11, width: '100px', margin: '2px' }}>
                    </View>
                    <View style={{ display: 12, width: '5px', margin: '2px' }}>
                        <Text style={{ fontSize: '7.5px' }}></Text>
                    </View>
                </View>
                <Text style={{ fontSize: 8, left: 40, right: 0, textAlign: 'left', bottom: 30, position: 'absolute', color: 'grey', }} fixed>Fecha: {new Date().toLocaleDateString('es-ES')}</Text>
                <Text style={{ fontSize: 8, left: 130, right: 0, textAlign: 'left', bottom: 30, position: 'absolute', color: 'grey', }} fixed>Hora: {new Date().toLocaleTimeString()}</Text>
                <Text style={styles.pageNumber} render={({ pageNumber }) => (
                    `Pag ${pageNumber}`
                )} fixed />
            </Page>
        </Document>
    );
}