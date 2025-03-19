
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import prisma from './prisma.js'

const app = new Hono()


app.get('/contacts', async (c) => {
  const contacts = await prisma.contact.findMany()
  return c.json(contacts)
})

app.post('/contacts', async (c) => {
  const body = await c.req.json()
  const { name, phone } = body

  try {
    const contact = await prisma.contact.create({
      data: { name, phone },
    })
    return c.json(contact)
  } catch (error) {
    return c.json({ error: 'Unable to create contact' }, 400)
  }
})

app.patch('/contacts/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const { name, phone } = body

  try {
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { name, phone },
    })
    return c.json(updatedContact)
  } catch (error) {
    return c.json({ error: 'Contact not found' }, 404)
  }
})

app.delete('/contacts/:id', async (c) => {
  const id = c.req.param('id')

  try {
    await prisma.contact.delete({
      where: { id },
    })
    return c.json({ message: 'Contact deleted successfully' })
  } catch (error) {
    return c.json({ error: 'Contact not found' }, 404)
  }
})


serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
