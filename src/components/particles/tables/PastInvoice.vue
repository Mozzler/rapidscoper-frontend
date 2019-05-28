<template>
  <v-data-table
    :headers="headers"
    :items="items"
    item-key="name"
    :hide-actions="true"
    class="dashboard-table dashboard-table-mt-16 wo-m-24">

    <template v-slot:items="props">
      <tr @click="props.expanded = !props.expanded">
        <td> {{ props.item.invoice }} </td>
        <td> {{ props.item.price }} </td>
        <td> <v-icon>picture_as_pdf</v-icon> </td>
      </tr>
      <span class="tr-border" />
    </template>
  </v-data-table>
</template>

<script>
  export default {
    name: "PastInvoice",
    data() {
      return {
        headers: [
          {
            text: 'invoice',
            sortable: false,
            value: 'invoice'
          },
          {
            text: 'price',
            sortable: false,
            value: 'price'
          },
          {
            text: 'actions',
            sortable: false,
            value: 'actions'
          },
        ],
        items: [
          {
            invoice: 'Invoice for 5th May 2019',
            price: '$ 49.95'
          },
          {
            invoice: 'Invoice for 5th May 2019',
            price: '$ 49.95'
          },
        ]
      }
    }
  }
</script>
